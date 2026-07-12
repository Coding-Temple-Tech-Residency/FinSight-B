import { useState } from "react";
import { useInsights } from "../hooks/useInsights";
const Insights = () => {
  const [activeTab, setActiveTab] = useState("for-you");
  const { data: insights = [], isLoading, isError } = useInsights();
  console.log(insights);

  const filteredInsights = insights.filter((item) => {
    switch (activeTab) {
      case "for-you":
        return true;
      case "earnings":
        return item.category === "earnings";
      case "market":
        return item.category === "market";
      case "news":
        return item.category === "news";
      default:
        return true;
    }
  });

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
            {isLoading && <p>Loading...</p>}

            {isError && <p>Unable to load insights.</p>}

            {!isLoading &&
              !isError &&
              filteredInsights.map((item) => (
                <div key={item.id} className="insights-card">
                  <div className="flex items-start gap-5">
                    <div className="insights-icon"></div>

                    <div>
                      <h3 className="insights-title font-semibold text-lg">
                        {item.title}
                      </h3>

                      <p className="insights-text text-sm mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <span className="font-medium text-sm">
                          {item.sentiment}
                        </span>

                        <span className="insights-text text-sm">
                          {item.created_at}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Insights;
