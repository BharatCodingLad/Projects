"use client"; // Mark as a Client Component

import { useState, useRef, useEffect } from "react";
import { sendMessageToGemini } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import "@fontsource/playfair-display"; // Import Playfair Display font
import "@fontsource/roboto"; // Import Roboto font

// Theme configurations
const themes = {
  princess: {
    background: "bg-gradient-to-b from-purple-100 to-pink-100",
    chatBg: "bg-white/80",
    border: "border-pink-200",
    buttonGradient:
      "from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500",
    text: "text-purple-900", // Adjusted text color for better visibility
    chatText: "text-pink-800", // Adjusted chat text color for better visibility
    placeholderText: "placeholder-gray-600", // Adjusted placeholder text color for better visibility
    gradientText: "from-purple-600 to-pink-500",
    title: "Royal Assistant",
    you: "👑Your highness",
    text_theme: "text-purple-900",
    fontFamily: "'Playfair Display', serif",
    stickers: [
      "🎀",
      "👑",
      "🌸",
      "🦄",
      "🫖",
      "✨",
      "💖",
      "🌟",
      "🎭",
      "🪄",
      "🦋",
      "🌺",
      "🎪",
      "🔮",
      "🎇",
      "💫",
      "⭐",
      "🌙",
      "💝",
      "🎈",
    ],
  },
  goth: {
    background: "bg-gradient-to-b from-gray-900 to-purple-900",
    chatBg: "bg-gray-800/80",
    border: "border-purple-800",
    buttonGradient:
      "from-purple-800 to-gray-900 hover:from-purple-900 hover:to-black",
    text: "text-gray-200", // Adjusted text color for better visibility
    chatText: "text-blue-200", // Adjusted chat text color for better visibility
    placeholderText: "placeholder-gray-400", // Adjusted placeholder text color for better visibility
    gradientText: "from-purple-400 to-pink-300",
    title: "Dark Mistresss",
    you: "🌙Darkling",
    text_theme: "text-blue-500",
    fontFamily: "'Roboto', sans-serif",
    stickers: [
      "🖤",
      "🗡️",
      "🌙",
      "🕯️",
      "🦇",
      "💀",
      "🕸️",
      "🔮",
      "⛓️",
      "🪦",
      "🎭",
      "🥀",
      "⚰️",
      "🐈‍⬛",
      "🌑",
      "✴️",
      "🎪",
      "📿",
      "💜",
      "🕊️",
    ],
  },
};

// Enhanced Floating stickers component
const FloatingStickers = ({ currentTheme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(40)].map((_, i) => {
        const stickers = themes[currentTheme].stickers;
        const randomSticker =
          stickers[Math.floor(Math.random() * stickers.length)];
        const randomLeft = Math.random() * 100;
        const randomTop = Math.random() * 100;
        const randomDuration = 10 + Math.random() * 30;
        const randomDelay = Math.random() * -30;
        const randomSize = Math.random() * 25 + 10;

        return (
          <div
            key={i}
            className="absolute animate-float opacity-20 hover:opacity-70 transition-opacity duration-500"
            style={{
              left: `${randomLeft}%`,
              top: `${randomTop}%`,
              animation: `float ${randomDuration}s ease-in-out infinite`,
              animationDelay: `${randomDelay}s`,
              fontSize: `${randomSize}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {randomSticker}
          </div>
        );
      })}
    </div>
  );
};

export default function Chat() {
  const [theme, setTheme] = useState("princess");
  const [input, setInput] = useState(""); // User input
  const [messages, setMessages] = useState([]); // Chat history
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Copy message content to clipboard
  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Function to send user input to Gemini API
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const timestamp = new Date();

    // Add user message to chat history
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        timestamp,
      },
    ]);

    try {
      // Pass the current theme to the API
      const aiResponse = await sendMessageToGemini(input, theme);

      // Add AI response to chat history
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            theme === "princess"
              ? "The magic mirror is clouded. Please try again."
              : "The darkness has swallowed my words. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "princess" ? "goth" : "princess");
  };

  return (
    <div
      className={`fixed inset-0 ${themes[theme].background} transition-colors duration-500`}
      style={{ fontFamily: themes[theme].fontFamily }}
    >
      <FloatingStickers currentTheme={theme} />

      <div className="h-screen max-w-4xl mx-auto p-4 flex flex-col">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 p-3 rounded-full 
                     bg-gradient-to-r ${themes[theme].buttonGradient}
                     text-white shadow-lg hover:scale-105 transition-all
                     focus:outline-none focus:ring-2 focus:ring-purple-400`}
          title={
            theme === "princess"
              ? "Switch to Goth Mode"
              : "Switch to Princess Mode"
          }
        >
          {theme === "princess" ? "🖤" : "👑"}
        </button>

        {/* Header Section */}
        <div className="h-[15vh] flex flex-col justify-center items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-center">
            <span
              className={`bg-gradient-to-r ${themes[theme].gradientText} text-transparent bg-clip-text`}
            >
              {theme === "princess"
                ? "✨ Princess Chat Palace ✨"
                : "🖤 Gothic Realm Chat 🖤"}
            </span>
          </h1>

          <p
            className={`text-center ${themes[theme].text} mt-2 italic font-medium text-sm sm:text-base`}
          >
            {theme === "princess"
              ? "Welcome to your magical chat kingdom, where dreams come true 🌟"
              : "Enter the dark realm of enchanted conversations 🌙"}
          </p>
        </div>

        {/* Chat Container */}
        <div
          className={`h-[70vh] relative ${themes[theme].chatBg} backdrop-blur-sm 
                    border-2 ${themes[theme].border} rounded-2xl shadow-lg 
                    flex flex-col overflow-hidden transition-colors duration-500`}
        >
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-300 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-300 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-300 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-300 rounded-br-2xl"></div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`relative p-3 sm:p-4 my-2 sm:my-3 rounded-2xl 
                           ${
                             msg.role === "user"
                               ? `ml-auto bg-gradient-to-r ${themes[theme].buttonGradient} text-white max-w-[85%] sm:max-w-[80%] shadow-md`
                               : `mr-auto ${themes[theme].chatBg} ${themes[theme]} max-w-[90%] sm:max-w-[85%] border ${themes[theme].border} shadow-sm`
                           }`}
              >
                {/* Message Header with enhanced styling */}
                <div className="flex justify-between items-center mb-1 sm:mb-2 text-xs sm:text-sm">
                  <span className="font-medium flex items-center gap-1 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {msg.role === "user" ? (
                      <>
                        <span className="hidden sm:inline font-semibold color-white">
                          {themes[theme].you}
                        </span>
                      </>
                    ) : (
                      <>
                        🌟{" "}
                        <span className="hidden sm:inline font-serif color-white">
                          {themes[theme].title}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="opacity-75 text-xs">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* Message Content with enhanced typography */}
                <div
                  className={` max-w-none
                              ${
                                msg.role === "user"
                                  ? "prose-invert"
                                  : themes[theme].chatText
                              }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(msg.content)}
                    className="p-1.5 sm:p-2 text-xs bg-white/30 hover:bg-white/50 rounded-full
                              backdrop-blur-sm transition-all hover:scale-110"
                    title="Copy message"
                  >
                    ✨
                  </button>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="h-[15vh] flex flex-col justify-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className={`w-full p-3 ${themes[theme].chatBg} backdrop-blur-sm 
                     ${themes[theme].chatText}
                     border-2 ${themes[theme].border} rounded-2xl
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                     ${themes[theme].placeholderText} resize-none h-16
                     font-medium transition-colors duration-500`}
            placeholder={
              theme === "princess"
                ? "✨ Share your wishes and dreams..."
                : "🖤 Whisper your dark thoughts..."
            }
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <span
              className={`text-xs sm:text-sm ${themes[theme].text} font-medium italic`}
            >
              {theme === "princess"
                ? "✨ Sprinkle some magical markdown ✨"
                : "🖤 Cast your markdown spells 🖤"}
            </span>
            <button
              onClick={sendMessage}
              className={`px-6 py-2.5 bg-gradient-to-r ${
                themes[theme].buttonGradient
              }
                       text-white rounded-full font-medium
                       focus:outline-none focus:ring-2 focus:ring-purple-400 
                       transition-all transform hover:scale-105 shadow-md
                       ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                       hover:shadow-lg active:scale-95`}
              disabled={isLoading}
            >
              {isLoading
                ? theme === "princess"
                  ? "✨ Casting Spell..."
                  : "🖤 Summoning..."
                : theme === "princess"
                ? "✨ Send Wishes ✨"
                : "🖤 Cast Message 🖤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
