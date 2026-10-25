import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askLegalAdvisor(e) {
    e.preventDefault();

    if (!question.trim()) {
      setAnswer("Please enter your legal question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/legal-advice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          `Server error: ${response.status}`
        );
      }

      setAnswer(
        data.answer || "The server returned an empty answer."
      );
    } catch (error) {
      console.error("Legal Advisor frontend error:", error);
      setAnswer(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>⚖️ AI Legal Advisor</h2>
        <span>Legal information assistant</span>
      </nav>

      <main className="hero">
        <h1>Your AI Legal Assistant</h1>
        <p>
          Ask questions and understand your legal options.
        </p>

        <form onSubmit={askLegalAdvisor}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: What should I do if my landlord refuses to return my security deposit in India?"
            rows="5"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Getting Answer..." : "Get Legal Guidance"}
          </button>
        </form>

        {answer && (
          <section className="answer">
            <h2>Legal Guidance</h2>
            <p>{answer}</p>
          </section>
        )}

        <p className="disclaimer">
          Disclaimer: This tool provides general legal information,
          not a substitute for advice from a qualified lawyer.
        </p>
      </main>

      <footer>
        AI Legal Advisor © 2026
      </footer>
    </div>
  );
}

export default App;