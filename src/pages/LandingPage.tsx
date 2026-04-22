import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Client Panel",
    desc: "Project tracking, milestone updates, and invoice history — all in one place for your clients.",
    icon: "📊",
    accent: "purple",
  },
  {
    title: "Task Manager",
    desc: "Kanban boards, deadlines, and assignments to keep every employee on track.",
    icon: "📋",
    accent: "teal",
  },
  {
    title: "Invoice Generator",
    desc: "Generate professional PDF invoices with QR code payments in seconds.",
    icon: "🧾",
    accent: "purple",
  },
  {
    title: "Analytics Dashboard",
    desc: "KPIs, revenue charts, and performance metrics at a glance.",
    icon: "📈",
    accent: "teal",
  },
  {
    title: "Internal Chat",
    desc: "Real-time messaging between teams, clients, and admins.",
    icon: "💬",
    accent: "purple",
  },
  {
    title: "AI Assistant",
    desc: "Smart predictions, natural language queries, and automated insights.",
    icon: "🤖",
    accent: "teal",
  },
];

const steps = [
  {
    num: "01",
    title: "Admin sets up the workspace",
    desc: "Create teams, assign roles, and configure modules for your organization.",
    accent: "purple",
  },
  {
    num: "02",
    title: "Team gets to work",
    desc: "Employees manage tasks, track progress, and collaborate in real time.",
    accent: "teal",
  },
  {
    num: "03",
    title: "Clients stay in the loop",
    desc: "Clients view project updates, download invoices, and communicate directly.",
    accent: "purple",
  },
  {
    num: "04",
    title: "Everyone stays notified",
    desc: "Automated alerts, status changes, and reminders keep everyone aligned.",
    accent: "teal",
  },
];

const team = [
  {
    name: "Tushar",
    role: "Frontend (Public Pages & Client Panel)",
    accent: "purple",
    initial: "T",
  },
  {
    name: "Hiba",
    role: "Frontend (Admin Panel)",
    accent: "teal",
    initial: "H",
  },
  {
    name: "Sara Amina",
    role: "Frontend (Employee Panel)",
    accent: "purple",
    initial: "S",
  },
  {
    name: "Fatima Riaz",
    role: "Database (Design & Optimization)",
    accent: "teal",
    initial: "F",
  },
  {
    name: "Muhammad Bilal",
    role: "Backend (Admin & Employee APIs)",
    accent: "purple",
    initial: "M",
  },
  {
    name: "Hamza Anis",
    role: "Backend (Public & Client APIs)",
    accent: "teal",
    initial: "H",
  },
];

const stats = [
  { value: "3", label: "Role-Based Panels" },
  { value: "7+", label: "Core Modules" },
  { value: "1", label: "Unified Platform" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = ["Features", "How It Works", "Team"];
  const sectionIds: Record<string, string> = {
    Features: "features",
    "How It Works": "how-it-works",
    Team: "team",
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-border" : ""
        }`}
        style={
          scrolled
            ? {
                background: "rgba(12,12,18,0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }
            : { background: "transparent" }
        }
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="5"
                  rx="1.5"
                  fill="white"
                  opacity="0.9"
                />
                <rect
                  x="3"
                  y="10"
                  width="18"
                  height="5"
                  rx="1.5"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="3"
                  y="17"
                  width="18"
                  height="4"
                  rx="1.5"
                  fill="white"
                  opacity="0.35"
                />
              </svg>
            </div>
            <span className="text-lg font-bold font-heading tracking-tight">
              IBO<span style={{ color: "#7F77DD" }}>S</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(sectionIds[l])}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => navigate("/login")}
              className="text-sm px-5 py-2 rounded-lg border border-border bg-transparent hover:border-primary hover:text-primary transition-all"
            >
              Sign In →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-foreground transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-foreground transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-3"
            style={{
              background: "rgba(12,12,18,0.95)",
              backdropFilter: "blur(16px)",
            }}
          >
            {navLinks.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(sectionIds[l])}
                className="text-sm text-muted-foreground hover:text-foreground text-left py-2"
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
              className="text-sm px-5 py-2 rounded-lg border border-border hover:border-primary text-left mt-1"
            >
              Sign In →
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pb-0 pt-16">
        {/* Orbs */}
        <div
          className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] rounded-full opacity-20 blur-[100px] animate-float-1"
          style={{ background: "#7F77DD" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[380px] h-[380px] rounded-full opacity-15 blur-[100px] animate-float-2"
          style={{ background: "#1D9E75" }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in-up">
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border mb-8 text-xs text-muted-foreground"
            style={{ background: "rgba(22,22,30,0.7)" }}
          >
            <span className="w-2 h-2 rounded-full bg-success inline-block" />
            INNOVELOUS INTERNSHIP 2026 — TEAM 5
          </div>

          <h1
            className="font-heading font-bold leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            One Suite to Run
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Entire Business
            </span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            IBOS centralizes client management, employee workflows, and admin
            operations into one powerful, unified platform — built for modern
            startups.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
                boxShadow: "0 0 30px rgba(127,119,221,0.25)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 50px rgba(127,119,221,0.45)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(127,119,221,0.25)")
              }
            >
              Get Started →
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              See Features
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-3xl font-heading font-bold"
                  style={{
                    background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#7F77DD" }}
          >
            WHAT'S INSIDE
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Everything a growing startup needs
          </h2>
        </div>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {features.map((f, i) => {
            const color = f.accent === "purple" ? "#7F77DD" : "#1D9E75";
            return (
              <div
                key={i}
                className="rounded-2xl p-6 border border-border transition-all duration-300 hover:-translate-y-1 cursor-default group"
                style={{
                  background: "linear-gradient(145deg, #1a1a24, #14141c)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${color}18` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#1D9E75" }}
          >
            THE FLOW
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Up and running in minutes
          </h2>
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{
              background: "linear-gradient(to bottom, #7F77DD, #1D9E75)",
            }}
          />

          <div className="flex flex-col gap-12">
            {steps.map((s, i) => {
              const color = s.accent === "purple" ? "#7F77DD" : "#1D9E75";
              return (
                <div key={i} className="flex gap-6 items-start">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-heading shrink-0 relative z-10 border-2"
                    style={{ borderColor: color, color, background: "#0c0c12" }}
                  >
                    {s.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-heading font-semibold mb-1">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#7F77DD" }}
          >
            THE BUILDERS
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Team 5 — Innovelous 2026
          </h2>
        </div>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {team.map((m, i) => {
            const color = m.accent === "purple" ? "#7F77DD" : "#1D9E75";
            return (
              <div
                key={i}
                className="rounded-2xl p-6 border border-border text-center transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{
                  background: "linear-gradient(145deg, #1a1a24, #14141c)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  }}
                >
                  {m.initial}
                </div>
                <h3 className="font-heading font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.role}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div
          className="relative rounded-2xl p-10 md:p-14 text-center border border-border overflow-hidden"
          style={{ background: "linear-gradient(145deg, #1a1a24, #14141c)" }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #7F77DD, #1D9E75, transparent)",
            }}
          />
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Sign in to your IBOS workspace and start managing your business from
            a single, powerful dashboard.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7F77DD, #1D9E75)",
              boxShadow: "0 0 30px rgba(127,119,221,0.25)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 50px rgba(127,119,221,0.45)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 0 30px rgba(127,119,221,0.25)")
            }
          >
            Sign In to IBOS →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-heading font-bold tracking-tight">
            IBO<span style={{ color: "#7F77DD" }}>S</span>
          </span>
          <p className="text-xs text-muted-foreground">
            © 2026 Innovelous Tech — Team 5. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
