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
          className={`px-4 py-2 rounded-lg ${
            activeTab === "for-you"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          For You
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "earnings"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Earnings
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "market"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Market
        </button>

        <button
          onClick={() => setActiveTab("news")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "news"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-white"
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
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Apple Q1 Earnings Analysis
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Apple reported Q1.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Bullish
                    </span>
                    <span className="text-gray-500 text-sm">2h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* card-2 */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    NVIDIA Earnings Analysis
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    NVIDIA beat expectations.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Bullish
                    </span>
                    <span className="text-gray-500 text-sm">4h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* card-3 */}
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Market Outlook
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Tech Sector showing.....
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-yellow-400 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="text-gray-500 text-sm">8h ago</span>
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
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Upcoming Earnings
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Upcoming...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      upcoming
                    </span>
                    <span className="text-gray-400 text-sm">Tomorow</span>
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
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Market Summary
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Upcoming...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="text-yellow-400 text-sm">Today</span>
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
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center"></div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Market News
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">News...</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-green-400 font-medium text-sm">
                      Neutral
                    </span>
                    <span className="text-yellow-400 text-sm">Today</span>
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
