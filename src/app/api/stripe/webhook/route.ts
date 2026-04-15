import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export const runtime = "nodejs";

function getUserIdFromObject(
  obj: Stripe.Subscription | Stripe.Checkout.Session
): string | null {
  return obj.metadata?.supabase_user_id ?? null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = getUserIdFromObject(session);
      const plan = session.metadata?.plan;

      if (!userId || !plan) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      const trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: plan,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: session.customer as string,
          subscription_status: subscription.status,
          subscription_period_end: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
          trial_ends_at: trialEnd,
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = getUserIdFromObject(subscription);

      if (!userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_subscription_id", subscription.id)
          .single();

        if (!profile) break;

        await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
            subscription_period_end: new Date(
              (subscription as unknown as { current_period_end: number }).current_period_end * 1000
            ).toISOString(),
          })
          .eq("id", profile.id);

        break;
      }

      await supabase
        .from("profiles")
        .update({
          subscription_status: subscription.status,
          subscription_period_end: new Date(
            (subscription as unknown as { current_period_end: number }).current_period_end * 1000
          ).toISOString(),
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = getUserIdFromObject(subscription);

      const query = supabase.from("profiles").update({
        subscription_tier: "free",
        subscription_status: "canceled",
        stripe_subscription_id: null,
      });

      if (userId) {
        await query.eq("id", userId);
      } else {
        await query.eq("stripe_subscription_id", subscription.id);
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as unknown as { subscription: string | null }).subscription;

      if (!subscriptionId) break;

      await supabase
        .from("profiles")
        .update({ subscription_status: "past_due" })
        .eq("stripe_subscription_id", subscriptionId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
