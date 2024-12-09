"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCompletionWithContext } from "@/lib/rag/generate/generate-completion";
import { runRagPipeline } from "@/lib/rag/retrieval/run-rag-pipeline";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function AiChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [currentDocs, setCurrentDocs] = useState<string[]>([]);
  const [expandedSources, setExpandedSources] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setCurrentDocs([]);

    try {
      const relevantDocs = await runRagPipeline(input);
      const context = relevantDocs.map((doc) => doc.content).join("\n\n");

      setCurrentDocs(relevantDocs.map((doc) => doc.content));
      const answer = await generateCompletionWithContext(context, input);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `${answer}`
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error processing your request."
        }
      ]);
      console.log(error);
    }

    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Underwriting Questions</h2>
      <div className="flex mb-4">
        <Input
          className="flex-grow mr-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-green-600 hover:bg-green-800 mr-2 font-bold"
        >
          Send
        </Button>
        <Button
          onClick={() => setMessages([])}
          variant="outline"
        >
          Reset
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto  border rounded p-4">
        {messages.map((message, index) => (
          <>
            <div
              key={`message-${index}`}
              className={`mb-4 p-3 rounded ${message.role === "ai" ? "bg-blue-50" : "bg-green-50"}`}
            >
              <strong>{message.role === "ai" ? "AI: " : "You: "}</strong>
              <ReactMarkdown 
                className="prose prose-sm max-w-none prose-a:text-blue-600 prose-a:underline"
                components={{
                  p: ({children}) => <p className="mt-2">{children}</p>,
                  ul: ({children}) => <ul className="list-disc ml-6 mt-2">{children}</ul>,
                  li: ({children}) => <li className="mt-1">{children}</li>,
                  a: ({children, href}) => (
                    <a href={href} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {message.role === "user" && currentDocs.length > 0 && index === messages.length - 2 && (
              <div
                key={`docs-${index}`}
                className="mb-4"
              >
                <button
                  onClick={() => setExpandedSources(expandedSources === index ? null : index)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <span>
                    {expandedSources === index ? "Hide" : "Show"} {currentDocs.length} sources
                  </span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${expandedSources === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {expandedSources === index && (
                  <div className="mt-2 p-3 rounded bg-gray-50 font-mono text-sm">
                    {currentDocs.map((doc, i) => (
                      <div
                        key={i}
                        className="mt-4 first:mt-0 pt-4 border-t first:border-t-0 border-gray-200 flex gap-4"
                      >
                        <span className="text-3xl font-bold text-gray-300">{i + 1}</span>
                        <div>{doc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ))}
        <div ref={messagesEndRef} />
      </div>

      
    </div>
  );
}