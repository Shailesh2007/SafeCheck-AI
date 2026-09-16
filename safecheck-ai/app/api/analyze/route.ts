import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `
You are SafeCheck AI, a cybersecurity awareness assistant.

Analyze the user's message for possible scams, phishing, fraud,
social engineering, fake offers, suspicious payment requests,
OTP/password requests, malicious links, or urgency tactics.

Return ONLY valid JSON in this format:

{
  "riskScore": number,
  "level": "LOW" | "MEDIUM" | "HIGH",
  "summary": "short explanation",
  "redFlags": ["flag 1", "flag 2"],
  "recommendation": "what the user should do"
}

riskScore must be between 0 and 100.
Do not claim that a message is definitely malicious unless the
evidence strongly supports it.
`,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
  const errorData = await response.text();

  console.error("Groq API Error:", errorData);

  return NextResponse.json(
    {
      error: "AI service request failed.",
      details: errorData,
    },
    { status: 502 }
  );
}

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No analysis was returned." },
        { status: 502 }
      );
    }

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      { error: "Unable to analyze the message." },
      { status: 500 }
    );
  }
}