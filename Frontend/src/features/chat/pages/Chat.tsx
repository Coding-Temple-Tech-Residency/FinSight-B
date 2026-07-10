import { useState } from "react";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div>
      <div className="p-6">
        <h1>Chat</h1>
        {/* buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`tab-button ${
              activeTab === "overview"
                ? "tab-button-active"
                : "tab-button-inactive"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`tab-button ${
              activeTab === "news" ? "tab-button-active" : "tab-button-inactive"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`tab-button ${
              activeTab === "earnings"
                ? "tab-button-active"
                : "tab-button-inactive"
            }`}
          >
            Earnings
          </button>

          <button
            onClick={() => setActiveTab("answers")}
            className={`tab-button ${
              activeTab === "answers"
                ? "tab-button-active"
                : "tab-button-inactive"
            }`}
          >
            Answers
          </button>
        </div>

        {/* ActiveTab-overview */}
        {activeTab === "overview" && (
          <>
            <div className="mt-8 space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-green-600 text-white p-4 rounded-2xl max-w-md">
                  What stocks in my portfolio have the highest growth potential?
                </div>
              </div>

              {/* AI Response */}
              <div className="chat-card">
                <p className="mt-4 chat-text">
                  Based on your portfolio, here are the stocks with the highest
                  growth potential:...
                </p>

                <p className="mt-4 chat-text">
                  Would you like me to analyze any of these in more detail?
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-3 mt-6">
                <input
                  type="text"
                  placeholder="Ask anything about your portfolio..."
                  className="flex-1 chat-input"
                />

                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12">
                  ➜
                </button>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-news */}
        {activeTab === "news" && (
          <>
            <div className="mt-8 space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-green-600 text-white p-4 rounded-2xl max-w-md">
                  Latest News ....
                </div>
              </div>

              {/* AI Response */}
              <div className="chat-card">
                <p className="mt-4 chat-text">Apple Annouce...</p>

                <p className="mt-4 chat-text">
                  Would you like me to analyze any of these in more detail?
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-3 mt-6">
                <input
                  type="text"
                  placeholder="Ask anything about your portfolio..."
                  className="flex-1 chat-input"
                />

                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12">
                  ➜
                </button>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-earnings */}
        {activeTab === "earnings" && (
          <>
            <div className="mt-8 space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-green-600 text-white p-4 rounded-2xl max-w-md">
                  Upcoming Earnings
                </div>
              </div>

              {/* AI Response */}
              <div className="chat-card">
                <p className="mt-4 chat-text">Apple..</p>

                <p className="mt-4 chat-text">
                  Would you like me to analyze any of these in more detail?
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-3 mt-6">
                <input
                  type="text"
                  placeholder="Ask anything about your portfolio..."
                  className="flex-1 chat-input"
                />

                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12">
                  ➜
                </button>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-answers */}
        {activeTab === "answers" && (
          <>
            <div className="mt-8 space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-green-600 text-white p-4 rounded-2xl max-w-md">
                  How can I..?
                </div>
              </div>

              {/* AI Response */}
              <div className="chat-card">
                <p className="mt-4 chat-text">Loading..</p>

                <p className="mt-4 chat-text">
                  Would you like me to analyze any of these in more detail?
                </p>
              </div>

              {/* Input */}
              <div className="flex gap-3 mt-6">
                <input
                  type="text"
                  placeholder="Ask anything about your portfolio..."
                  className="flex-1 chat-input"
                />

                <button className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12">
                  ➜
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
