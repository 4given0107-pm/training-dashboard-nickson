import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) fetchCourses();
  }, [session]);

  async function fetchCourses() {
    setLoading(true);
    const { data, error } = await supabase.from("Courses").select("*");
    if (!error) setCourses(data);
    setLoading(false);
  }

  async function handleLogin() {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!session) return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } input:focus { border-color: #f59e0b !important; }`}</style>
      <div style={{ background: "#1a1d27", border: "1px solid #2a2d3a", borderRadius: 12, padding: 48, width: 400, maxWidth: "95vw" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, background: "#f59e0b", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚡</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#e8e6e1", margin: 0 }}>TrainCore</h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#6b7280", marginTop: 8 }}>Sign in to access your training</p>
        </div>
        {authError && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#f87171", marginBottom: 16, textAlign: "center", background: "#f871711a", padding: "8px 12px", borderRadius: 6 }}>{authError}</p>
        )}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>Email</p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="you@company.com"
            style={{ width: "100%", padding: "10px 14px", background: "#0f1117", border: "1px solid #2a2d3a", borderRadius: 6, color: "#e8e6e1", fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, outline: "none" }}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>Password</p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            type="password"
            placeholder="••••••••"
            style={{ width: "100%", padding: "10px 14px", background: "#0f1117", border: "1px solid #2a2d3a", borderRadius: 6, color: "#e8e6e1", fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, outline: "none" }}
          />
        </div>
        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: "12px", background: "#f59e0b", color: "#0f1117", border: "none", borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  const completed = courses.filter(c => c.status === "completed").length;

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "#0f1117", color: "#e8e6e1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .course-card { background: #1a1d27; border: 1px solid #2a2d3a; border-radius: 10px; padding: 24px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
        .course-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #f59e0b, transparent); opacity: 0; transition: opacity 0.3s; }
        .course-card:hover { border-color: #f59e0b66; transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .course-card:hover::before { opacity: 1; }
        .nav-btn { cursor: pointer; padding: 8px 18px; font-family: 'Source Sans 3', sans-serif; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; color: #9ca3af; border: none; background: transparent; border-bottom: 2px solid transparent; }
        .nav-btn:hover { color: #e8e6e1; }
        .nav-btn.active { color: #f59e0b; border-bottom-color: #f59e0b; }
        .progress-bg { background: #2a2d3a; border-radius: 99px; height: 5px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #f59e0b, #fbbf24); transition: width 0.6s ease; }
        .stat-card { background: #1a1d27; border: 1px solid #2a2d3a; border-radius: 8px; padding: 28px 24px; transition: border-color 0.2s; }
        .stat-card:hover { border-color: #f59e0b44; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#13161f", borderBottom: "1px solid #2a2d3a", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#f59e0b", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#e8e6e1" }}>TrainCore</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {["dashboard", "courses"].map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#6b7280" }}>{session.user.email}</span>
          <button onClick={handleLogout} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 14px", background: "transparent", border: "1px solid #2a2d3a", color: "#9ca3af", borderRadius: 4, cursor: "pointer" }}>Sign Out</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, fontFamily: "'Source Sans 3', sans-serif", color: "#6b7280", fontSize: 14, letterSpacing: "0.1em" }}>Loading courses...</div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>Welcome back</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>Your Training Dashboard</h1>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#9ca3af", marginBottom: 36 }}>
                  {courses.length} courses available in your library.
                </p>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
                  {[
                    { label: "Total Courses", value: courses.length },
                    { label: "Published", value: courses.filter(c => c.is_published).length },
                    { label: "Categories", value: [...new Set(courses.map(c => c.category))].length },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 10 }}>{s.label}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#f59e0b" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Available Courses</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                  {courses.slice(0, 3).map(course => (
                    <CourseCard key={course.id} course={course} onOpen={setSelectedCourse} />
                  ))}
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === "courses" && (
              <div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>Library</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 32, letterSpacing: "-0.02em" }}>All Courses</h1>
                {courses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 80, color: "#6b7280", fontFamily: "'Source Sans 3', sans-serif" }}>
                    No courses yet. Add some in your Supabase dashboard!
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {courses.map(course => (
                      <CourseCard key={course.id} course={course} onOpen={setSelectedCourse} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Course Modal */}
      {selectedCourse && (
        <div onClick={() => setSelectedCourse(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1a1d27", border: "1px solid #2a2d3a", borderRadius: 12, width: 520, maxWidth: "95vw", padding: 36, position: "relative" }}>
            <button onClick={() => setSelectedCourse(null)} style={{ position: "absolute", top: 16, right: 20, background: "transparent", border: "none", color: "#9ca3af", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            <div style={{ fontSize: 44, marginBottom: 16 }}>{selectedCourse.thumbnail_emoji || "📚"}</div>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>{selectedCourse.category}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 12, color: "#e8e6e1" }}>{selectedCourse.title}</p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#9ca3af", lineHeight: 1.7, marginBottom: 24 }}>{selectedCourse.description}</p>
            <div style={{ height: 1, background: "#2a2d3a", marginBottom: 24 }} />
            <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
              {[["Duration", selectedCourse.duration], ["Lessons", selectedCourse.lesson_count]].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 4 }}>{k}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f59e0b" }}>{v}</p>
                </div>
              ))}
            </div>
            {selectedCourse.video_url && (
              <a
                href={selectedCourse.video_url}
                target="_blank"
                rel="noreferrer"
                style={{ display: "block", width: "100%", padding: "13px", background: "#f59e0b", color: "#0f1117", borderRadius: 6, fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", textDecoration: "none" }}
              >
                Start Course →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onOpen }) {
  return (
    <div className="course-card" onClick={() => onOpen(course)}>
      <div style={{ fontSize: 34, marginBottom: 14 }}>{course.thumbnail_emoji || "📚"}</div>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>{course.category}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 8, color: "#e8e6e1" }}>{course.title}</p>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{course.description}</p>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: "#9ca3af" }}>{course.duration} · {course.lesson_count} lessons</p>
    </div>
  );
}
