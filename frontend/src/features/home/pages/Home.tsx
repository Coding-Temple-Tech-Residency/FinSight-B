import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../../components/Logo";
import ThemeButton from "../../../components/ThemeButton";
import AuthForm from "../../auth/components/AuthForm";
import AuthenticatedHomePreview from "../components/AuthenticatedHomePreview";
import GuestHomePreview from "../components/GuestHomePreview";
import HomePreviewChart from "../components/HomePreviewChart";

import { useBreakpoint } from "../../../hooks/useBreakingPoint";
import { useModal } from "../../../hooks/useModal";
import { useAuth } from "../../auth/hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

import { stats } from "../../../data/stats";
import { features } from "../../../data/features";
import { homeNavigation } from "../../../constants/navigation";
import "../styles/home.css";

type HomeProps = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const Home = ({ isOpen, openMenu, closeMenu }: HomeProps) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const navigate = useNavigate();

  const { user, isAuthenticated, loading, logout } = useAuth();
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

  const renderAuthActions = () => {
    if (loading) {
      return <span className="px-5 py-2 text-sm opacity-70">Loading...</span>;
    }

    if (isAuthenticated) {
      return (
        <>
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="home-header-cta-signup rounded-xl px-5 py-2 font-bold"
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
          className="home-header-cta-signup rounded-xl px-5 py-2 font-bold"
          onClick={handleRegisterClick}
        >
          Sign Up
        </button>
      </>
    );
  };

  const menuIcon = isOpen ? faTimes : faBars;

  return (
    <div className="home">
      <header className="home-header sticky top-0 left-0 z-50 inline-flex min-h-17.5 w-full items-center justify-between overflow-y-auto bg-(--bg-primary) px-3">
        <Link to="/" className="logo-link" onClick={closeMenu}>
          <Logo />
        </Link>

        <nav
          className={`home-nav m-auto items-center justify-center bg-(--bg-primary) px-5 py-3 transition-all duration-300 ${
            isOpen ? "flex translate-y-0 flex-col" : "-translate-y-300"
          } ${
            isDesktop
              ? "static translate-y-0"
              : "fixed top-0 left-0 h-screen w-screen -translate-y-300"
          }`}
        >
          <ul
            className={`home-nav-ul flex flex-col items-center justify-center gap-3 lg:flex-row lg:gap-5 ${
              isOpen && !isDesktop ? "m-auto h-full w-full" : ""
            }`}
          >
            {homeNavigation.map((item) => (
              <li className="home-nav-li" key={item.id}>
                <a
                  href={`#${item.section}`}
                  onClick={() => {
                    if (!isDesktop) {
                      closeMenu();
                    }
                  }}
                  className={`home-nav-li-a rounded-lg px-3 py-2 transition-all duration-300 hover:text-emerald-500 ${
                    isDesktop ? "block px-5" : "inline-block"
                  }`}
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
            type="button"
            className="menu-btn z-60"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            onClick={isOpen ? closeMenu : openMenu}
          >
            <FontAwesomeIcon
              icon={menuIcon}
              className="cursor-pointer text-2xl"
            />
          </button>
        )}

        {isDesktop && (
          <div className="home-header-cta flex gap-3">
            {renderAuthActions()}
          </div>
        )}
      </header>

      <main className="home-main flex min-h-svh flex-col pt-5">
        <section
          className="hero mx-auto grid min-h-[90svh] max-w-7xl grid-cols-1 items-center gap-10 px-3 max-lg:min-h-svh lg:grid-cols-2 lg:px-10"
          id="hero"
        >
          <article className="hero-left flex flex-col gap-6">
            <p className="ai-promo w-fit rounded-full bg-(--bg-secondary) px-4 py-2 text-sm font-semibold text-(--accent-secondary)">
              {loading
                ? "Loading your account..."
                : isAuthenticated
                  ? `Welcome back, ${user?.first_name ?? "Investor"}`
                  : "✨ AI-Powered Investment Intelligence"}
            </p>

            <div className="hero-headers">
              <h1 className="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
                Smarter Insights.
              </h1>

              <h1 className="text-5xl leading-tight font-bold text-(--accent-primary) md:text-6xl lg:text-7xl">
                Better Investments.
              </h1>
            </div>

            <p className="hero-text max-w-xl text-lg opacity-80">
              {loading
                ? "Preparing your investment overview."
                : isAuthenticated
                  ? "Review your combined investment performance or return to your dashboard for more details."
                  : "Track your portfolio, analyze stocks, and get AI-powered insights that help you make clearer investment decisions."}
            </p>

            <section className="hero-cta flex flex-col gap-3 sm:flex-row">
              {!loading &&
                (isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="rounded-xl bg-(--accent-primary) px-6 py-4 text-center font-bold text-(--bg-primary) transition-all duration-300 hover:bg-(--accent-secondary)"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="rounded-xl bg-(--accent-primary) px-6 py-4 text-center font-bold text-(--bg-primary) transition-all duration-300 hover:bg-(--accent-secondary)"
                  >
                    Get Started Free
                  </button>
                ))}

              <a
                href="#preview"
                className="rounded-xl border border-white/15 px-6 py-4 text-center font-bold transition-all duration-300 hover:bg-(--bg-secondary)"
              >
                Watch Demo
              </a>
            </section>
          </article>

          <article className="hero-right">
            {loading ? (
              <div className="dashboard-mockup rounded-3xl border border-white/10 bg-(--bg-secondary) p-5 shadow-2xl">
                <div className="flex min-h-72 items-center justify-center">
                  <p className="opacity-70">
                    Loading your portfolio overview...
                  </p>
                </div>
              </div>
            ) : isAuthenticated ? (
              <AuthenticatedHomePreview />
            ) : (
              <GuestHomePreview />
            )}
          </article>
        </section>

        <section className="stats grid grid-cols-2 gap-5 px-3 py-10 lg:grid-cols-4 lg:px-10">
          {stats.map((stat) => (
            <article
              key={stat.id}
              className="stat-card flex flex-col items-center gap-2 text-center"
            >
              <FontAwesomeIcon
                icon={stat.icon}
                className="text-2xl text-(--accent-primary)"
              />

              <h3 className="font-bold text-(--accent-primary)">
                {stat.numbers}
              </h3>

              <p>{stat.title}</p>
            </article>
          ))}
        </section>

        <section className="features px-3 py-20 lg:px-10" id="features">
          <div className="mb-10 text-center">
            <h2>Everything you need to make smarter investment decisions</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="feature-card rounded-2xl border border-white/10 bg-(--bg-secondary) p-6"
              >
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="mb-5 text-2xl text-(--accent-secondary)"
                />

                <h3 className="mb-3 font-bold">{feature.title}</h3>

                <p className="text-sm opacity-80">{feature.message}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about px-3 py-24 lg:px-10" id="about">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
            <article>
              <span className="font-semibold tracking-widest text-(--accent-secondary) uppercase">
                About FinSight
              </span>

              <h2 className="mt-4">
                Investing should be simple,
                <span className="text-(--accent-primary)">
                  {" "}
                  not overwhelming.
                </span>
              </h2>

              <p className="mt-6 leading-8 opacity-80">
                Every day investors are flooded with earnings reports, financial
                news, analyst opinions, and market data. FinSight uses
                Artificial Intelligence to organize that information into clear
                insights that anyone can understand.
              </p>

              <p className="mt-5 leading-8 opacity-80">
                Whether you&apos;re tracking your first investment or managing a
                growing portfolio, FinSight helps you understand what&apos;s
                happening, why it matters, and what to watch next.
              </p>
            </article>

            <article className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">AI Analysis</h3>

                <p className="mt-3 opacity-80">
                  Earnings reports explained in plain English.
                </p>
              </div>

              <div className="rounded-3xl bg-(--bg-secondary) p-6">
                <h3 className="text-(--accent-primary)">Portfolio Tracking</h3>

                <p className="mt-3 opacity-80">
                  Monitor gains, losses, and asset allocation.
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

        <section className="dashboard-preview px-3 py-20 lg:px-10" id="preview">
          <div className="mb-10 text-center">
            <h2>
              {isAuthenticated
                ? "Explore the full FinSight dashboard"
                : "Beautiful dashboards that give you clarity"}
            </h2>

            <p className="opacity-80">
              {isAuthenticated
                ? "This product demo shows how FinSight presents investment information. Open your dashboard to view your live account data."
                : "Visualize your portfolio, monitor your holdings, and stay ahead of the market."}
            </p>
          </div>

          <article className="preview-card mx-auto max-w-6xl rounded-3xl border border-white/10 bg-(--bg-secondary) p-5 lg:p-8">
            <div className="mb-5 flex items-center justify-between gap-5">
              <div>
                <h3 className="font-bold">Dashboard Preview</h3>

                <p className="text-sm opacity-70">Example product data</p>
              </div>

              <span className="rounded-full bg-(--accent-primary)/10 px-3 py-1 text-sm font-semibold text-(--accent-primary)">
                Product Demo
              </span>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="rounded-2xl bg-(--bg-primary) p-5">
                <p className="opacity-70">Example Portfolio Value</p>

                <h3 className="text-3xl font-bold">$28,560.00</h3>

                <p className="text-(--accent-primary)">+2.45% (+$682.54)</p>
              </div>

              <div className="rounded-2xl bg-(--bg-primary) p-5">
                <p className="opacity-70">Example Day Change</p>

                <h3 className="text-3xl font-bold">+$682.54</h3>

                <p className="text-(--accent-primary)">+2.45%</p>
              </div>

              <div className="rounded-2xl bg-(--bg-primary) p-5">
                <p className="opacity-70">Example Buying Power</p>

                <h3 className="text-3xl font-bold">$4,250.00</h3>

                <p className="text-(--accent-secondary)">Demo account cash</p>
              </div>
            </div>

            <div className="rounded-2xl bg-(--bg-primary) p-5">
              <div className="mb-5 flex justify-between gap-5">
                <div>
                  <h3 className="font-bold">Portfolio Performance</h3>

                  <p className="text-sm opacity-70">Example historical chart</p>
                </div>

                <span className="h-fit rounded-full bg-(--accent-primary)/10 px-3 py-1 text-sm font-semibold text-(--accent-primary)">
                  Demo
                </span>
              </div>

              <div className="h-60">
                <HomePreviewChart />
              </div>
            </div>

            {isAuthenticated && (
              <div className="mt-6 flex justify-center">
                <Link
                  to="/dashboard"
                  className="rounded-xl bg-(--accent-primary) px-6 py-3 font-bold text-(--bg-primary)"
                >
                  View My Live Dashboard
                </Link>
              </div>
            )}
          </article>
        </section>

        <section
          className="ai-section bg-(--bg-secondary) px-3 py-20 lg:px-10"
          id="ai"
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <article>
              <h2>AI that understands the market</h2>

              <p className="mt-4 opacity-80">
                FinSight analyzes earnings reports, market news, and portfolio
                activity to give investors simple, useful explanations.
              </p>

              {isAuthenticated ? (
                <Link
                  to="/dashboard/insights"
                  className="mt-6 inline-block rounded-xl bg-(--accent-primary) px-6 py-4 font-bold text-white"
                >
                  View AI Insights
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="mt-6 inline-block rounded-xl bg-(--accent-primary) px-6 py-4 font-bold text-white"
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
                  className="rounded-2xl border border-white/10 bg-(--bg-primary) p-5"
                >
                  <div className="flex justify-between gap-5">
                    <div>
                      <h3 className="font-bold">{title}</h3>

                      <p className="mt-2 text-sm opacity-80">{message}</p>
                    </div>

                    <span className="h-fit rounded-full bg-(--accent-secondary) px-3 py-1 text-sm text-(--bg-primary)">
                      {tag}
                    </span>
                  </div>
                </div>
              ))}
            </article>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer px-3 py-10 lg:px-10">
        <section className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-(--bg-secondary) p-8 lg:flex-row lg:p-12">
          <div>
            <h2>
              {isAuthenticated
                ? "Ready to review your investments?"
                : "Ready to invest smarter?"}
            </h2>

            <p className="mt-2 opacity-80">
              {isAuthenticated
                ? "Return to your dashboard to review portfolios, holdings, watchlists, and insights."
                : "Join investors using FinSight to make clearer, data-driven decisions."}
            </p>
          </div>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-(--accent-primary) px-6 py-4 font-bold text-white"
            >
              Return to Dashboard
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleRegisterClick}
              className="rounded-xl bg-(--accent-primary) px-6 py-4 font-bold text-white"
            >
              Get Started Free
            </button>
          )}
        </section>

        <section className="mt-10 flex flex-col justify-between gap-5 py-5 opacity-80 md:flex-row lg:py-5">
          <p className="max-lg:text-center">
            © 2026 FinSight. All rights reserved.
          </p>

          <div className="flex items-center justify-between gap-5">
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

      {!loading && !isAuthenticated && isModalOpen("login") && (
        <AuthForm mode={authMode} />
      )}
    </div>
  );
};

export default Home;
