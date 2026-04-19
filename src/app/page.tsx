import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

// Lets Google render rich result cards (Organization knowledge panel,
// SoftwareApplication pricing snippet) from the landing page.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://eagle-eye.hatedapps.pl/#organization",
      name: "Eagle Eye",
      url: "https://eagle-eye.hatedapps.pl",
      logo: "https://eagle-eye.hatedapps.pl/icon.svg",
      description:
        "Monitoring przetargów szkoleniowych BZP, TED, BUR i KFS z AI scoringiem.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://eagle-eye.hatedapps.pl/#app",
      name: "Eagle Eye",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://eagle-eye.hatedapps.pl",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PLN",
        description: "Plan Free — do 10 powiadomień dziennie",
      },
      inLanguage: "pl",
      publisher: { "@id": "https://eagle-eye.hatedapps.pl/#organization" },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
