import { createAnthropic } from "@ai-sdk/anthropic";

let _anthropic: ReturnType<typeof createAnthropic> | null = null;

export function getAnthropicClient() {
  if (!_anthropic) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");
    _anthropic = createAnthropic({ apiKey: key });
  }
  return _anthropic;
}
