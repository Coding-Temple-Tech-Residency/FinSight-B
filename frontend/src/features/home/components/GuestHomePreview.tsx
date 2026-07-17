import HomePreviewChart from "./HomePreviewChart";

const GuestHomePreview = () => {
  return (
    <div className="dashboard-mockup rounded-3xl bg-(--bg-secondary) border border-white/10 p-5 shadow-2xl">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold">Dashboard</h3>

        <span className="text-(--accent-primary) text-sm">Demo Preview</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">Portfolio Value</p>
          <h4 className="text-2xl font-bold">$28,560.00</h4>
          <p className="text-(--accent-primary) text-sm">+2.45%</p>
        </div>

        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="text-sm opacity-70">AI Signal</p>
          <h4 className="text-2xl font-bold">Bullish</h4>
          <p className="text-(--accent-secondary) text-sm">Demo Insight</p>
        </div>
      </div>

      <div className="rounded-2xl bg-(--bg-primary) p-4 mb-4">
        <div className="flex justify-between mb-3">
          <p className="font-semibold">Performance</p>
          <p className="text-(--accent-primary)">Demo</p>
        </div>

        <HomePreviewChart />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="font-semibold mb-3">Top Movers</p>

          {["AAPL +2.35%", "NVDA +3.21%", "MSFT -0.45%"].map((stock) => (
            <p key={stock} className="text-sm opacity-80 mb-2">
              {stock}
            </p>
          ))}
        </div>

        <div className="rounded-2xl bg-(--bg-primary) p-4">
          <p className="font-semibold mb-3">AI Insight</p>

          <p className="text-sm opacity-80">
            Example AI-generated market insights will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestHomePreview;
