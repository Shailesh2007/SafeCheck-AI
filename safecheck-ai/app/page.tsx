"use client";

import { useState } from "react";

const quizQuestions = [
  {
    question: "Someone calls asking for your OTP. What should you do?",
    options: [
      "Share the OTP",
      "Ask them why they need it",
      "Never share the OTP",
      "Send the OTP later",
    ],
    answer: 2,
  },
  {
    question: "Which is a common sign of a phishing message?",
    options: [
      "A normal greeting",
      "Urgent request for sensitive information",
      "A message from a friend",
      "A weather update",
    ],
    answer: 1,
  },
  {
    question: "What should you do before clicking a suspicious link?",
    options: [
      "Click it immediately",
      "Forward it to friends",
      "Verify the sender and URL",
      "Disable antivirus",
    ],
    answer: 2,
  },
  {
    question: "Which password is strongest?",
    options: [
      "password123",
      "shailesh2007",
      "12345678",
      "A long unique password with mixed characters",
    ],
    answer: 3,
  },
  {
    question: "You receive a message saying you won a prize you never entered for. What is safest?",
    options: [
      "Click the claim link",
      "Provide your bank details",
      "Ignore it and verify independently",
      "Send your OTP",
    ],
    answer: 2,
  },
];

type MessageResult = {
  riskScore: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  redFlags: string[];
  recommendation: string;
};

type UrlResult = {
  url: string;
  domain: string;
  riskScore: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  redFlags: string[];
  recommendation: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messageResult, setMessageResult] =
    useState<MessageResult | null>(null);

  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState<UrlResult | null>(null);

  const [messageLoading, setMessageLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(false);

  const [messageError, setMessageError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
const [quizScore, setQuizScore] = useState(0);
const [quizFinished, setQuizFinished] = useState(false);
  async function analyzeMessage() {
    if (!message.trim()) return;

    setMessageLoading(true);
    setMessageResult(null);
    setMessageError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setMessageResult(data);
    } catch (error) {
      setMessageError(
        error instanceof Error
          ? error.message
          : "Unable to analyze the message."
      );
    } finally {
      setMessageLoading(false);
    }
  }

  async function checkUrl() {
    if (!url.trim()) return;

    setUrlLoading(true);
    setUrlResult(null);
    setUrlError("");

    try {
      const response = await fetch("/api/url-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "URL check failed");
      }

      setUrlResult(data);
    } catch (error) {
      setUrlError(
        error instanceof Error
          ? error.message
          : "Unable to check the URL."
      );
    } finally {
      setUrlLoading(false);
    }
  }
    function answerQuestion(selectedAnswer: number) {
    const question = quizQuestions[currentQuestion];

    if (selectedAnswer === question.answer) {
      setQuizScore((score) => score + 1);
    }

    if (currentQuestion === quizQuestions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentQuestion((question) => question + 1);
    }
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setQuizScore(0);
    setQuizFinished(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl">
              🛡️
            </div>

            <div>
              <h1 className="text-lg font-bold">SafeCheck AI</h1>
              <p className="text-xs text-slate-400">
                Cybersecurity Awareness
              </p>
            </div>
          </div>

          <div className="hidden gap-6 text-sm text-slate-400 md:flex">
            <button
  onClick={() =>
    document.getElementById("scanner")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="transition hover:text-white"
>
  Scanner
</button>

<button
  onClick={() =>
    document.getElementById("url-check")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="transition hover:text-white"
>
  URL Check
</button>

<button
  onClick={() =>
    document.getElementById("quiz")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="transition hover:text-white"
>
  Quiz
</button>

<button
  onClick={() =>
    document.getElementById("awareness")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="transition hover:text-white"
>
  Awareness
</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            🔒 AI-Powered Cybersecurity Protection
          </div>

          <h2 className="text-4xl font-bold sm:text-6xl">
            Think Before You
            <span className="text-blue-500"> Click.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Detect suspicious messages and risky URLs before they become a
            problem.
          </p>
        </div>

        {/* MESSAGE SCANNER */}
       <div
  id="scanner"
  className="mx-auto mt-14 max-w-4xl"
>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                🔍
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  Scam Message Scanner
                </h3>

                <p className="text-sm text-slate-400">
                  Analyze SMS, WhatsApp, email, or social-media messages.
                </p>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a suspicious message here..."
              className="h-48 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-5 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                🔐 AI analyzes the message for scam indicators.
              </p>

              <button
                onClick={analyzeMessage}
                disabled={!message.trim() || messageLoading}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {messageLoading
                  ? "🔄 Analyzing..."
                  : "🔍 Analyze Message"}
              </button>
            </div>

            {messageError && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                ⚠️ {messageError}
              </div>
            )}

            {messageResult && (
              <ResultCard result={messageResult} />
            )}
          </div>
        </div>

        {/* URL CHECKER */}
        <div
  id="url-check"
  className="mx-auto mt-10 max-w-4xl"
>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                🔗
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  URL Safety Checker
                </h3>

                <p className="text-sm text-slate-400">
                  Check a suspicious link for common phishing indicators.
                </p>
              </div>
            </div>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-5 text-sm outline-none placeholder:text-slate-600 focus:border-purple-500"
            />

            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                🔎 Checks domain and URL characteristics.
              </p>

              <button
                onClick={checkUrl}
                disabled={!url.trim() || urlLoading}
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {urlLoading ? "🔄 Checking..." : "🔗 Check URL"}
              </button>
            </div>

            {urlError && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                ⚠️ {urlError}
              </div>
            )}

            {urlResult && (
              <UrlResultCard result={urlResult} />
            )}
          </div>
        </div>

        {/* FEATURES */}
        <div id="quiz" className="mt-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
  <div className="mb-8 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">
      🎯
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Cybersecurity Awareness Quiz
      </h3>

      <p className="text-sm text-slate-400">
        Test your knowledge and learn how to stay safe online.
      </p>
    </div>
  </div>

  {!quizFinished ? (
    <>
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </p>

        <h4 className="mt-3 text-xl font-semibold">
          {quizQuestions[currentQuestion].question}
        </h4>
      </div>

      <div className="grid gap-3">
        {quizQuestions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => answerQuestion(index)}
            className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-left text-sm transition hover:border-blue-500 hover:bg-slate-800"
          >
            <span className="mr-3 font-semibold text-blue-400">
              {String.fromCharCode(65 + index)}.
            </span>

            {option}
          </button>
        ))}
      </div>
    </>
  ) : (
    <div className="text-center">
      <div className="text-5xl">
        {quizScore >= 4
          ? "🏆"
          : quizScore >= 3
          ? "👏"
          : "📚"}
      </div>

      <h4 className="mt-5 text-3xl font-bold">
        Quiz Complete!
      </h4>

      <p className="mt-3 text-slate-400">
        You scored
      </p>

      <p className="mt-2 text-5xl font-bold text-blue-500">
        {quizScore}/{quizQuestions.length}
      </p>

      <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400">
        {quizScore >= 4
          ? "Excellent! You have strong cybersecurity awareness."
          : quizScore >= 3
          ? "Good job! A little more awareness can make you safer online."
          : "Keep learning! Understanding common scams can help protect you online."}
      </p>

      <button
        onClick={restartQuiz}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
      >
        🔄 Retake Quiz
      </button>
    </div>
  )}
</div> 

       <div id="awareness" className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
  <div className="mb-8 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
      📚
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Cybersecurity Awareness Hub
      </h3>

      <p className="text-sm text-slate-400">
        Learn simple ways to protect yourself from common online threats.
      </p>
    </div>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <AwarenessCard
      icon="🎣"
      title="Phishing"
      text="Never click unexpected links. Verify the sender and website before sharing personal information."
    />

    <AwarenessCard
      icon="🔐"
      title="OTP Safety"
      text="Never share OTPs, PINs, passwords, or security codes with anyone."
    />

    <AwarenessCard
      icon="💳"
      title="Payment Scams"
      text="Be cautious with unexpected payment requests, QR codes, fake refunds, and banking requests."
    />

    <AwarenessCard
      icon="💼"
      title="Fake Job Scams"
      text="Be suspicious of jobs asking for registration fees, deposits, or sensitive personal information."
    />

    <AwarenessCard
      icon="📱"
      title="Social Media Scams"
      text="Watch out for fake profiles, giveaways, investment promises, and urgent requests."
    />

    <AwarenessCard
      icon="🛡️"
      title="Password Security"
      text="Use long, unique passwords and enable multi-factor authentication."
    />
  </div>
</div>
        </div>
        {/* SECURITY STATS */}
<div className="mt-10">
  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

    <div className="mb-8 text-center">
      <p className="text-sm font-medium text-blue-400">
        SAFE CHECK OVERVIEW
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        Your Security Toolkit
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Simple tools to help you identify and understand online threats.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
        <div className="text-3xl">🔍</div>

        <p className="mt-3 text-3xl font-bold">
          1
        </p>

        <p className="mt-1 text-sm text-slate-400">
          AI Message Scanner
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
        <div className="text-3xl">🔗</div>

        <p className="mt-3 text-3xl font-bold">
          1
        </p>

        <p className="mt-1 text-sm text-slate-400">
          URL Safety Checker
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">
        <div className="text-3xl">📚</div>

        <p className="mt-3 text-3xl font-bold">
          6
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Safety Topics
        </p>
      </div>

    </div>

    <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center">
      <p className="text-sm text-slate-300">
        🛡️ Stay alert. Verify before you click. Never share sensitive information.
      </p>
    </div>

  </div>
</div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        © 2026 SafeCheck AI • Stay Smart. Stay Safe.
      </footer>
    </main>
  );
}

function ResultCard({ result }: { result: MessageResult }) {
  return (
    <div className="mt-8 border-t border-slate-800 pt-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
          <p className="text-sm text-slate-400">Risk Score</p>

          <p className="mt-2 text-5xl font-bold">
            {result.riskScore}
          </p>

          <p className="mt-2 font-semibold">
            {result.level === "HIGH"
              ? "🔴 HIGH RISK"
              : result.level === "MEDIUM"
              ? "🟠 MEDIUM RISK"
              : "🟢 LOW RISK"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:col-span-2">
          <p className="font-semibold">Analysis</p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {result.summary}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h4 className="font-semibold">🚩 Detected Red Flags</h4>

        <ul className="mt-3 space-y-2">
          {result.redFlags.map((flag, index) => (
            <li key={index} className="text-sm text-slate-400">
              ⚠️ {flag}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
        <h4 className="font-semibold text-blue-300">
          🛡️ Recommended Action
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}

function UrlResultCard({ result }: { result: UrlResult }) {
  return (
    <div className="mt-8 border-t border-slate-800 pt-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
          <p className="text-sm text-slate-400">URL Risk Score</p>

         <p
  className={`mt-2 text-5xl font-bold ${
    result.level === "HIGH"
      ? "text-red-500"
      : result.level === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-400"
  }`}
>
  {result.riskScore}
</p>

          <p
  className={`mt-2 font-semibold ${
    result.level === "HIGH"
      ? "text-red-400"
      : result.level === "MEDIUM"
      ? "text-yellow-400"
      : "text-green-400"
  }`}
>
  {result.level === "HIGH"
    ? "🔴 HIGH RISK"
    : result.level === "MEDIUM"
    ? "🟡 MEDIUM RISK"
    : "🟢 LOW RISK"}
</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 md:col-span-2">
          <p className="text-sm text-slate-400">Domain</p>

          <p className="mt-2 break-all font-semibold">
            {result.domain}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h4 className="font-semibold">🚩 URL Indicators</h4>

        <ul className="mt-3 space-y-2">
          {result.redFlags.map((flag, index) => (
            <li key={index} className="text-sm text-slate-400">
              ⚠️ {flag}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
        <h4 className="font-semibold text-purple-300">
          🛡️ Recommended Action
        </h4>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 text-3xl">{icon}</div>

      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      <p className="text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function AwarenessCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700">
      <div className="mb-3 text-2xl">
        {icon}
      </div>

      <h4 className="font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}