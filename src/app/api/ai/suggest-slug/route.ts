import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { apiLimiter } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = apiLimiter(request);
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await request.json();
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: `Generate exactly 3 short, memorable URL slugs for this URL: ${url}

Rules:
- Each slug: 3-20 characters
- Only letters, numbers, hyphens
- Lowercase only
- Be descriptive but concise
- No generic words like "link" or "url"

Return ONLY a JSON array of 3 strings, nothing else. Example: ["my-blog", "tech-post", "dev-article"]`
    }]
  });

  const text = (message.content[0] as { type: string; text: string }).text.trim();
  try {
    const slugs = JSON.parse(text);
    if (Array.isArray(slugs) && slugs.length === 3) {
      return NextResponse.json({ slugs });
    }
    throw new Error("Invalid response");
  } catch {
    // Fallback: extract slugs from text
    const matches = text.match(/"([a-z0-9-]+)"/g)?.map((s: string) => s.replace(/"/g, "")) || [];
    return NextResponse.json({ slugs: matches.slice(0, 3) });
  }
}
