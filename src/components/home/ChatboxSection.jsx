import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbox() {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [typingEffect, setTypingEffect] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Animation for loading dots
  const [loadingDots, setLoadingDots] = useState(".");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots((dots) => (dots.length < 3 ? dots + "." : "."));
      }, 400);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Typing effect for responses
  useEffect(() => {
    if (response && !isTyping) {
      setIsTyping(true);
      setTypingEffect("");

      let i = 0;
      const typing = setInterval(() => {
        if (i < response.length) {
          setTypingEffect((prev) => prev + response.charAt(i));
          i++;
        } else {
          clearInterval(typing);
          setIsTyping(false);
        }
      }, 10); // Adjust speed as needed

      return () => clearInterval(typing);
    }
  }, [response]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [typingEffect, step, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 && destination.trim()) {
      setStep(2);
    } else if (step === 2 && numDays.trim()) {
      setStep(3);
      setLoading(true);
      setResponse("");

      try {
        const res = await fetch("http://localhost:8000/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination, num_days: numDays }),
        });

        if (!res.ok) {
          throw new Error("Lỗi từ server");
        }

        const data = await res.json();

        console.log("API Response:", data); // Kiểm tra nội dung phản hồi từ API

        setResponse(data?.itinerary || "Không nhận được phản hồi từ AI.");
      } catch (error) {
        setResponse("Lỗi khi tải lịch trình. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetChat = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setDestination("");
      setNumDays("");
      setResponse("");
      setTypingEffect("");
    }, 300);
  };

  // Format response for better display
  const formatResponse = (text) => {
    // Replace markdown headings with styled divs
    let formattedText = text
      .replace(
        /^# (.*$)/gm,
        '<div class="text-xl font-bold text-blue-700 mt-4 mb-2">$1</div>',
      )
      .replace(
        /^## (.*$)/gm,
        '<div class="text-lg font-bold text-blue-600 mt-3 mb-2">$1</div>',
      )
      .replace(
        /^### (.*$)/gm,
        '<div class="text-base font-bold text-blue-500 mt-2 mb-1">$1</div>',
      );

    return formattedText;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex size-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-900 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        style={{ transform: isOpen ? "scale(0.9)" : "scale(1)" }}
      >
        {isOpen ? (
          "✕"
        ) : (
          <svg
            xmlns=" http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="block border-gray-200 align-middle text-white"
          >
            <path
              d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
              class="border-gray-200"
            ></path>
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-[calc(4rem+2rem)] right-6 z-40 w-[430px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Travel Assistant</h2>
                <p className="text-xs opacity-80">
                  Powered by AI Travel Planner
                </p>
              </div>
              <button
                onClick={resetChat}
                className="rounded-full bg-white bg-opacity-20 p-2 text-xs hover:bg-opacity-30"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Chat content */}
          <div
            ref={chatContainerRef}
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-96 overflow-y-auto p-4 pt-6"
          >
            {/* Bot messages */}
            <div className="mb-4 flex">
              <div className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                🤖
              </div>
              <div className="max-w-[80%] rounded-lg rounded-tl-none bg-blue-100 p-3 text-sm text-gray-700">
                {step === 1 &&
                  "Xin chào! Bạn muốn lên kế hoạch đi du lịch đến đâu?"}
                {step === 2 &&
                  `Tuyệt vời! Bạn dự định đi ${destination} trong bao nhiêu ngày?`}
                {step === 3 &&
                  loading &&
                  `Đang tạo lịch trình cho chuyến đi ${destination} trong ${numDays} ngày${loadingDots}`}
              </div>
            </div>

            {/* User messages */}
            {step > 1 && (
              <div className="mb-4 flex justify-end">
                <div className="max-w-[80%] rounded-lg rounded-br-none bg-blue-500 p-3 text-sm text-white">
                  {destination}
                </div>
              </div>
            )}

            {step > 2 && !loading && (
              <div className="mb-4 flex justify-end">
                <div className="max-w-[80%] rounded-lg rounded-br-none bg-blue-500 p-3 text-sm text-white">
                  {numDays} ngày
                </div>
              </div>
            )}

            {/* Response */}
            {!loading && typingEffect && (
              <div className="mb-4 flex">
                <div className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  🤖
                </div>
                <div className="max-w-[90%] rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="mb-2 mt-4 text-xl font-bold text-blue-700"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="mb-2 mt-3 text-lg font-bold text-blue-600"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="mb-1 mt-2 text-base font-bold text-blue-500"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc space-y-1 pl-5" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal space-y-1 pl-5"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-2 leading-relaxed" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a className="text-blue-500 underline" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-bold text-gray-800"
                            {...props}
                          />
                        ),
                        hr: ({ node, ...props }) => (
                          <hr className="my-3 border-gray-200" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="border-l-4 border-blue-300 pl-3 italic text-gray-600"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {typingEffect}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4"
          >
            <div className="flex items-center space-x-2">
              {step === 1 && (
                <input
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Nhập điểm đến..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  autoFocus
                />
              )}

              {step === 2 && (
                <input
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  type="number"
                  min="1"
                  placeholder="Nhập số ngày..."
                  value={numDays}
                  onChange={(e) => setNumDays(e.target.value)}
                  autoFocus
                />
              )}

              {step < 3 && (
                <button
                  type="submit"
                  disabled={step === 1 ? !destination : !numDays}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Gửi
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={resetChat}
                  className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Tạo lịch trình mới
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
