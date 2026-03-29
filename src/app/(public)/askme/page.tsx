"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Copy, Check, Sparkles, AlertCircle, RefreshCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, TextUIPart } from "ai";
import { SkeletonLoader } from "@/components/chat/Loader";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isTyping = status === "submitted" || status === "streaming";
  const hasError = status === "error";
  const hasMessages = messages.length > 0;

  // Persistent Auto-Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, error]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput("");

    try {
      await sendMessage({ text: userMessage });
    } catch (err) {
      console.error("Saify failed to respond:", err);
    }
  };

  const copyToClipboard = (parts: any[], id: string) => {
    const textToCopy = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-dvh w-full max-w-3xl mx-auto relative overflow-hidden bg-background">
      {!hasMessages && !isTyping && (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 space-y-4 animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
            <div className="relative p-4 rounded-2xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center">
            Hello there!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md px-4">
            I'm <span className="font-semibold text-blue-500">Saify</span>, your AI assistant. How can I help you today?
          </p>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 px-4 max-w-lg">
            {["What can you help me with?", "Tell me about this hostel", "How do I register?"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Container - Takes remaining space */}
      {(hasMessages || isTyping) && (
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 pt-4 pb-2"
        >
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex w-full flex-col group animate-in slide-in-from-bottom-2 duration-300",
                  m.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "max-w-[90%] sm:max-w-[85%] px-4 py-3 rounded-2xl transition-all",
                  m.role === "user"
                    ? "bg-linear-to-br from-slate-600 to-slate-700 text-white rounded-br-md shadow-lg shadow-slate-500/15"
                    : "bg-muted/50 backdrop-blur-sm border border-border/50 text-foreground rounded-bl-md"
                )}>
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Saify</span>
                    </div>
                  )}

                  <div className={cn(
                    "prose prose-sm dark:prose-invert max-w-none wrap-break-word leading-relaxed [&>p]:my-1 [&>p:last-child]:mb-0 [&>p:first-child]:mt-0",
                    m.role === "user" && "prose-invert"
                  )}>
                    {m.parts.map((part, i) => (
                      <React.Fragment key={i}>
                        {part.type === "text" && <ReactMarkdown>{part.text}</ReactMarkdown>}

                        {part.type === "reasoning" && (
                          <div className="text-xs italic opacity-60 mb-2 p-3 border-l-2 border-blue-500/50 bg-muted/30 rounded-r-lg not-prose">
                            <span className="block font-bold not-italic mb-1 opacity-100 uppercase tracking-tighter text-blue-500">
                              Thinking Process:
                            </span>
                            {part.text}
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => copyToClipboard(m.parts, m.id)}
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Skeleton Loader while typing */}
            {isTyping && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <SkeletonLoader />
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive animate-in shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Something went wrong</p>
                  <p className="opacity-80 text-xs mt-0.5">{error?.message || "Check your connection."}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 shrink-0"
                  onClick={() => {
                    const lastUserMsg = messages.filter(m => m.role === 'user').pop();
                    const lastText = lastUserMsg?.parts.find((p): p is TextUIPart => p.type === 'text')?.text;
                    if (lastText) sendMessage({ text: lastText });
                  }}
                >
                  <RefreshCcw className="h-4 w-4" /> Retry
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>
      )}

      {/* Sticky Input Form - Always at bottom */}
      <div
        className="shrink-0 bg-linear-to-t from-background via-background to-background/80 pt-3 pb-4 px-3 sm:px-4 md:px-6 border-t border-border/30"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <form
          onSubmit={handleSend}
          className="relative group bg-muted/40 backdrop-blur-xl border border-border/80 rounded-2xl sm:rounded-[24px] p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 shadow-lg shadow-black/5"
        >
          <div className="flex items-end gap-2 px-1 sm:px-2">
            <Textarea
              placeholder={isTyping ? "Responding..." : "Message Saify..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isTyping}
              className="flex-1 min-h-11 max-h-36 bg-transparent border-0 focus-visible:ring-0 resize-none py-3 text-sm placeholder:text-muted-foreground/60"
              rows={1}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={cn(
                "rounded-xl h-10 w-10 p-0 shrink-0 transition-all duration-200 active:scale-95",
                input.trim() && !isTyping
                  ? "bg-linear-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg shadow-slate-500/20"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </form>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
          Saify can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}