import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: "Please enter a URL." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid URL, for example https://example.com" },
        { status: 400 }
      );
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const fullUrl = parsedUrl.href.toLowerCase();

    const redFlags: string[] = [];
    let score = 0;

    // HTTPS check
    if (parsedUrl.protocol !== "https:") {
      score += 20;
      redFlags.push("Website does not use HTTPS");
    }

    // IP address instead of domain
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      score += 30;
      redFlags.push("URL uses an IP address instead of a domain name");
    }

    // Suspicious keywords
    const suspiciousKeywords = [
      "login",
      "verify",
      "verification",
      "password",
      "account",
      "secure",
      "update",
      "wallet",
      "bank",
      "payment",
      "claim",
      "free",
      "prize",
    ];

    const foundKeywords = suspiciousKeywords.filter((keyword) =>
      fullUrl.includes(keyword)
    );

    if (foundKeywords.length > 0) {
      score += Math.min(foundKeywords.length * 8, 24);
      redFlags.push(
        `Contains suspicious keywords: ${foundKeywords.join(", ")}`
      );
    }

    // Very long URL
    if (url.length > 120) {
      score += 15;
      redFlags.push("Unusually long URL");
    }

    // Excessive subdomains
    const subdomainCount = hostname.split(".").length - 2;

    if (subdomainCount >= 3) {
      score += 15;
      redFlags.push("Contains an unusual number of subdomains");
    }

    // @ symbol
    if (url.includes("@")) {
      score += 25;
      redFlags.push("Contains @ symbol, which can hide the actual destination");
    }

    // URL shorteners
    const shorteners = [
      "bit.ly",
      "tinyurl.com",
      "t.co",
      "goo.gl",
      "is.gd",
      "cutt.ly",
    ];

    if (shorteners.some((domain) => hostname === domain)) {
      score += 20;
      redFlags.push("Uses a URL shortening service");
    }

    score = Math.min(score, 100);

    let level: "LOW" | "MEDIUM" | "HIGH";

    if (score >= 60) {
      level = "HIGH";
    } else if (score >= 30) {
      level = "MEDIUM";
    } else {
      level = "LOW";
    }

    if (redFlags.length === 0) {
      redFlags.push("No obvious suspicious indicators detected");
    }

    const recommendation =
      level === "HIGH"
        ? "Avoid opening this URL. Do not enter passwords, OTPs, banking information, or personal details."
        : level === "MEDIUM"
        ? "Be cautious. Verify the website and its domain through an official source before continuing."
        : "No obvious red flags were detected, but always verify the website before entering sensitive information.";

    return NextResponse.json({
      url: parsedUrl.href,
      domain: hostname,
      riskScore: score,
      level,
      redFlags,
      recommendation,
    });
  } catch (error) {
    console.error("URL check error:", error);

    return NextResponse.json(
      { error: "Unable to check the URL." },
      { status: 500 }
    );
  }
}