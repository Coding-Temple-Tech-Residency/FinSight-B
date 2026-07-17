import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../../components/Logo";
import ThemeButton from "../../../components/ThemeButton";
import HomePreviewChart from "../components/HomePreviewChart";
import AuthForm from "../../auth/components/AuthForm";

import { useBreakpoint } from "../../../hooks/useBreakingPoint";
import { useModal } from "../../../hooks/useModal";
import { useAuth } from "../../auth/hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import { stats } from "../../../data/stats";
import { features } from "../../../data/features";
import { homeNavigation } from "../../../constants/navigation";

const Home = ({
  isOpen,
  openMenu,
  closeMenu,
}: {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();
  const { isModalOpen, openModal } = useModal();
  const { isDesktop } = useBreakpoint();

  const handleLoginClick = () => {
    setAuthMode("login");
    openModal("login");
    closeMenu();
  };

  const handleRegisterClick = () => {
    setAuthMode("register");
    openModal("login");
    closeMenu();
  };

  const handleLogout = async () => {
    closeMenu();

    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  };

  const menuIcon = isOpen ? faTimes : faBars;

  const renderAuthActions = () => {
    if (loading) {
      return null;
    }

    if (isAuthenticated) {
      return (
        <>
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="home-header-cta-signup px-5 py-2 rounded-xl font-bold"
          >
            Dashboard
          </Link>

          <button
            type="button"
            className="home-header-cta-login px-5 py-2 font-bold"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          className="home-header-cta-login px-5 py-2 font-bold"
          onClick={handleLoginClick}
        >
          Login
        </button>

        <button
          type="button"
          className="home-header-cta-signup px-5 py-2 rounded-xl font-bold"
          onClick={handleRegisterClick}
        >
          Sign Up
        </button>
      </>
    );
  };

  return (
    <div className="home">
      <header
        className={`home-header min-h-17.5 px-3 inline-flex justify-between items-center sticky top-0 left-0 z-50 bg-(--bg-primary) w-full overflow-y-auto`}
      >
        <a href="/" className="logo-link">
          <Logo />
        </a>

        <nav
          className={`home-nav bg-(--bg-primary) py-3 px-5 ${isOpen ? "translate-y-0 flex flex-col" : "-translate-y-300"} ${isDesktop ? "static translate-y-0" : "fixed top-0 left-0 h-screen w-screen -translate-y-300"} justify-center items-center m-auto transition-all duration-300`}
        >
          <ul
            className={`home-nav-ul flex flex-col lg:flex-row gap-3 lg:gap-5 justify-center items-center ${isOpen && !isDesktop ? "w-full h-full m-auto" : ""}`}
          >
            {homeNavigation.map((item) => (
              <li className={`home-nav-li`} key={item.id}>
                <a
                  href={`#${item.section}`}
                  onClick={() => {
                    if (!isDesktop) closeMenu();
                  }}
                  className={`home-nav-li-a px-3 ${isDesktop ? "block px-5" : "inline-block"} py-2 rounded-lg hover:text-emerald-500 transition-all duration-300`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          {!isDesktop && (
            <div className="home-header-cta flex gap-3 pb-10">
              {renderAuthActions()}
            </div>
          )}
        </nav>

        {!isDesktop && (
          <button
            className="menu-btn z-60"
            onClick={isOpen ? closeMenu : openMenu}
          >
            <FontAwesomeIcon
              icon={menuIcon}
              className="text-2xl cursor-pointer"
            />
          </button>
        )}

        {isDesktop && (
          <div className="home-header-cta flex gap-3">
            {renderAuthActions()}
          </div>
        )}
      </header>
      <main className="home-main min-h-svh flex flex-col pt-5">
        <section
          className="hero max-lg:min-h-svh min-h-[90vsh] px-3 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto"
          id="hero"
        >
          <article className="hero-left flex flex-col gap-6">
            <p className="ai-promo px-4 py-2 rounded-full bg-(--bg-secondary) text-(--accent-secondary) w-fit text-sm font-semibold">
              ✨ AI-Powered Investment Intelligence
            </p>

            <div className="hero-headers">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Smarter Insights.
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-(--accent-primary)">
                Better Investments.
              </h1>
            </div>

            <p className="hero-text max-w-xl text-lg opacity-80">
              Track your portfolio, analyze stocks, and get AI-powered insights
              that help you make clearer investment decisions.
            </p>

            <section className="hero-cta flex gap-3 flex-col sm:flex-row">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-4 rounded-xl font-bold bg-(--accent-primary) text-(--bg-primary) text-center hover:bg-(--accent-secondary) transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="px-6 py-4 rounded-xl font-bold bg-(--accent-primary) text-(--bg-primary) text-center hover:bg-(--accent-secondary) transition-all duration-300"
                >
                  Get Started Free
                </button>
              )}

              <a
                href="#preview"
                className="px-6 py-4 rounded-xl font-bold border border-white/15 text-center hover:bg-(--bg-secondary) transition-all duration-300"
              >
                Watch Demo
              </a>
            </section>
          </article>

          <article className="hero-right">
            <div className="dashboard-mockup rounded-3xl bg-(--bg-secondary) border border-white/10 p-5 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold">Dashboard</h3>
                <span className="text-(--accent-primary) text-sm">
                  Live Preview
                </span>
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
                  <p className="text-(--accent-secondary) text-sm">
                    Market Insight
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-(--bg-primary) p-4 mb-4">
                <div className="flex justify-between mb-3">
                  <p className="font-semibold">Performance</p>
                  <p className="text-(--accent-primary)">1M</p>
                </div>

                <HomePreviewChart />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-(--bg-primary) p-4">
                  <p className="font-semibold mb-3">Top Movers</p>
                  {["AAPL +2.35%", "NVDA +3.21%", "MSFT -0.45%"].map(
                    (stock) => (
                      <p key={stock} className="text-sm opacity-80 mb-2">
                        {stock}
                      </p>
                    ),
                  )}
                </div>

                <div className="rounded-2xl bg-(--bg-primary) p-4">
                  <p className="font-semibold mb-3">AI Insight</p>
                  <p className="text-sm opacity-80">
                    Tech stocks are showing strength after stronger earnings.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>
        <section className="stats grid grid-cols-2 lg:grid-cols-4 gap-5 px-3 lg:px-10 py-10">
          {stats.map((stat) => (
            <article
              key={stat.id}
              className="stat-card flex flex-col items-center gap-2 text-center"
            >
              <FontAwesomeIcon
                icon={stat.icon}
                className="text-(--accent-primary) text-2xl"
              />
              <h3 className="text-(--accent-primary) font-bold">
                {stat.numbers}
              </h3>
              <p>{stat.title}</p>
            </article>
          ))}
        </section>

        <section className="features px-3 lg:px-10 py-20" id="features">
          <div className="text-center mb-10">
            <h2>Everything you need to make smarter investment decisions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="feature-card bg-(--bg-secondary) rounded-2xl p-6 border border-white/10"
              >
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-(--accent-secondary) text-2xl mb-5"
                />
                <h3 className="font-bold mb-3">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.message}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="about px-3 lg:px-10 py-24" id="about">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <article>
              <span className="text-(--accent-secondary) font-semibold uppercase tracking-widest">
                About FinSight
              </span>

              <h2 className="mt-4">
                Investing should be simple,
                <span className="text-(--accent-primary)">
                  {" "}
                  not overwhelming.
                </span>
              </h2>

              <p className="mt-6 opacity-80 leading-8">
                Every day investors are flooded with earnings reports, financial
                news, analyst opinions, and market data. FinSight uses
                Artificial Intelligence to organize that information into clear
                insights that anyone can understand.
              </p>

              <p className="mt-5 opacity-80 leading-8">
                Whether you're tracking your first investment or managing a
                growing portfolio, FinSight helps you understand what's
                happening, why it matters, and what to watch next.
              </p>
            </article>

            {/* Right */}
            <article className="grid grid-cols-2 gap-5">
              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">AI Analysis</h3>

                <p className="mt-3 opacity-80">
                  Earnings reports explained in plain English.
                </p>
              </div>

              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">Portfolio Tracking</h3>

                <p className="mt-3 opacity-80">
                  Monitor gains, losses and asset allocation.
                </p>
              </div>

              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">Market Intelligence</h3>

                <p className="mt-3 opacity-80">
                  Real-time stock information and AI signals.
                </p>
              </div>

              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">Ask AI</h3>

                <p className="mt-3 opacity-80">
                  Ask questions about any stock or your portfolio.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="dashboard-preview px-3 lg:px-10 py-20" id="preview">
          <div className="text-center mb-10">
            <h2>Beautiful dashboards that give you clarity</h2>
            <p className="opacity-80">
              Visualize your portfolio, monitor your holdings, and stay ahead of
              the market.
            </p>
          </div>

          <article className="preview-card bg-(--bg-secondary) border border-white/10 rounded-3xl p-5 lg:p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <div className="rounded-2xl p-5 bg-(--bg-primary)">
                <p className="opacity-70">Portfolio Value</p>
                <h3 className="text-3xl font-bold">$28,560.00</h3>
                <p className="text-(--accent-primary)">+2.45% (+$682.54)</p>
              </div>

              <div className="rounded-2xl p-5 bg-(--bg-primary)">
                <p className="opacity-70">Day Change</p>
                <h3 className="text-3xl font-bold">+$682.54</h3>
                <p className="text-(--accent-primary)">+2.45%</p>
              </div>

              <div className="rounded-2xl p-5 bg-(--bg-primary)">
                <p className="opacity-70">Buying Power</p>
                <h3 className="text-3xl font-bold">$4,250.00</h3>
                <p className="text-(--accent-secondary)">Available cash</p>
              </div>
            </div>

            <div className="rounded-2xl bg-(--bg-primary) p-5">
              <div className="flex justify-between mb-5">
                <h3 className="font-bold">Portfolio Performance</h3>
                <span className="text-(--accent-primary)">1M</span>
              </div>

              <div className="h-60">
                <HomePreviewChart />
              </div>
            </div>
          </article>
        </section>
        <section
          className="ai-section px-3 lg:px-10 py-20 bg-(--bg-secondary)"
          id="ai"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
            <article>
              <h2>AI that understands the market</h2>
              <p className="opacity-80 mt-4">
                FinSight analyzes earnings reports, market news, and portfolio
                activity to give investors simple, useful explanations.
              </p>
              {isAuthenticated ? (
                <Link
                  to="/dashboard/insights"
                  className="inline-block mt-6 px-6 py-4 rounded-xl bg-(--accent-primary) font-bold text-white"
                >
                  View AI Insights
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="inline-block mt-6 px-6 py-4 rounded-xl bg-(--accent-primary) font-bold text-white"
                >
                  Learn More
                </button>
              )}
            </article>

            <article className="space-y-4">
              {[
                [
                  "NVIDIA Earnings Analysis",
                  "Revenue beat expectations with strong AI chip demand.",
                  "Bullish",
                ],
                [
                  "Fed Rate Decision Impact",
                  "Tech stocks may see volatility after rate guidance.",
                  "Neutral",
                ],
                [
                  "Portfolio Risk Alert",
                  "Your portfolio has high exposure to large-cap tech.",
                  "High Risk",
                ],
              ].map(([title, message, tag]) => (
                <div
                  key={title}
                  className="rounded-2xl bg-(--bg-primary) border border-white/10 p-5"
                >
                  <div className="flex justify-between gap-5">
                    <div>
                      <h3 className="font-bold">{title}</h3>
                      <p className="opacity-80 text-sm mt-2">{message}</p>
                    </div>
                    <span className="h-fit rounded-full px-3 py-1 text-sm bg-(--accent-secondary) text-(--bg-primary)">
                      {tag}
                    </span>
                  </div>
                </div>
              ))}
            </article>
          </div>
        </section>
      </main>{" "}
      <footer id="footer" className="footer px-3 lg:px-10 py-10">
        <section className="rounded-3xl bg-(--bg-secondary) p-8 lg:p-12 flex flex-col lg:flex-row justify-between gap-6 items-center">
          <div>
            <h2>Ready to invest smarter?</h2>
            <p className="opacity-80 mt-2">
              Join investors using FinSight to make clearer, data-driven
              decisions.
            </p>
          </div>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-4 rounded-xl bg-(--accent-primary) font-bold text-white"
            >
              Return to Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleRegisterClick}
              className="px-6 py-4 rounded-xl bg-(--accent-primary) font-bold text-white"
            >
              Get Started Free
            </button>
          )}
        </section>

        <section className="flex flex-col md:flex-row justify-between  gap-5 mt-10 opacity-80 py-5 lg:py-5">
          <p className="max-lg:text-center">
            © 2026 FinSight. All rights reserved.
          </p>
          <div className="flex gap-5 justify-between items-center">
            <a href="#features">Features</a>
            <a href="#ai">AI Insights</a>
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout}>
                Sign Out
              </button>
            ) : (
              <button type="button" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        </section>
      </footer>
      <ThemeButton />
      {!isAuthenticated && isModalOpen("login") && <AuthForm mode={authMode} />}
    </div>
  );
};

export default Home;
