import { useState } from "react";
const Insights = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  return (
    <div className="p-6">
      <h1>AI Insights</h1>
      {/* buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setActiveTab("for-you")}
          className={`tab-button ${
            activeTab === "for-you"
              ? "tab-button-active"
              : "tab-button-inactive"
          }`}
        >
          For You
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
          onClick={() => setActiveTab("market")}
          className={`tab-button ${
            activeTab === "market" ? "tab-button-active" : "tab-button-inactive"
          }`}
        >
          Market
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`tab-button ${
            activeTab === "news" ? "tab-button-active" : "tab-button-inactive"
          }`}
        >
          News
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {/* ActiveTab-For-you */}
        {activeTab === "for-you" && (
          <>
            {/* card-1 */}
            <div className="insights-card">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-cyan-400"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    Apple Q1 Earnings Analysis
                  </h3>
                  <p className="insights-text text-sm mt-1">
                    Apple reported Q1.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Bullish
                    </span>
                    <span className="insights-text text-sm">2h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* card-2 */}
            <div className="insights-card">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-green-400"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    NVIDIA Earnings Analysis
                  </h3>
                  <p className="insights-text text-sm mt-1">
                    NVIDIA beat expectations.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Bullish
                    </span>
                    <span className="insights-text text-sm">4h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* card-3 */}
            <div className="insights-card">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-yellow-500"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    Market Outlook
                  </h3>
                  <p className="insights-text text-sm mt-1">
                    Tech Sector showing.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-yellow-500 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="insights-text text-sm">8h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-Earnings */}
        {activeTab === "earnings" && (
          <>
            {/* {card1} */}
            <div className="insights-card rounded-2xl">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-cyan-400"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    Upcoming Earnings
                  </h3>
                  <p className="insights-text text-sm mt-1">Upcoming...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      upcoming
                    </span>
                    <span className="insights-text text-sm">Tomorow</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-Market */}
        {activeTab === "market" && (
          <>
            {/* card1 */}
            <div className="insights-card">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-yellow-500"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    Market Summary
                  </h3>
                  <p className="insights-text text-sm mt-1">Upcoming...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="text-yellow-500 text-sm">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ActiveTab-News */}
        {activeTab === "news" && (
          <>
            {/* card1 */}
            <div className="insights-card">
              <div className="flex items-start gap-5">
                <div className="insights-icon bg-yellow-500"></div>
                <div>
                  <h3 className="insights-title font-semibold text-lg">
                    Market News
                  </h3>
                  <p className="insights-text text-sm mt-1">News...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="text-yellow-500 text-sm">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Insights;
