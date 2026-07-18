const HomePreviewChart = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-3 px-5">
      <span className="text-lg font-bold">Portfolio performance preview</span>

      <span className="rounded-full bg-(--accent-primary)/10 px-3 py-1 text-sm font-semibold text-(--accent-primary)">
        Product Demo
      </span>

      <p className="max-w-md text-sm leading-6 opacity-70">
        Explore an example of how FinSight displays portfolio performance,
        market history, investment activity, and AI-powered insights.
      </p>
    </div>
  );
};

export default HomePreviewChart;
