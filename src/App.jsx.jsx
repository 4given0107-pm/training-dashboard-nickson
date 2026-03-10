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
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_e, session) => setSession(session));
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

  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];
  const filtered = selectedCategory === "All" ? courses : courses.filter(c => c.category === selectedCategory);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; min-height: 100vh; }
    body { background: #f0ede8; font-family: 'DM Sans', sans-serif; }
    :root {
      --bg: #f0ede8;
      --bg2: #e8e4de;
      --card: #ffffff;
      --dark: #1a1714;
      --accent: #d4521a;
      --accent2: #f0a875;
      --text: #1a1714;
      --muted: #7a7068;
      --border: #ddd9d3;
    }
    .page { width: 100%; min-height: 100vh; background: var(--bg); }

    /* LOGIN */
    .login-page { width: 100%; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
    .login-left { background: var(--dark); display: flex; flex-direction: column; justify-content: center; padding: 64px; position: relative; overflow: hidden; }
    .login-left::before { content: ''; position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, #d4521a22, transparent 70%); }
    .login-left::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, #f0a87522, transparent 70%); }
    .login-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 60px; }
    .login-brand-icon { width: 44px; height: 44px; background: var(--accent); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .login-brand-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .login-headline { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; }
    .login-sub { font-size: 16px; color: #9a9088; line-height: 1.7; max-width: 380px; }
    .login-right { background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 64px; }
    .login-form { width: 100%; max-width: 400px; }
    .login-form h2 { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .login-form p { font-size: 14px; color: var(--muted); margin-bottom: 36px; }
    .field-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
    .field-input { width: 100%; padding: 13px 16px; background: var(--card); border: 1.5px solid var(--border); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--dark); outline: none; transition: border-color 0.2s; margin-bottom: 20px; }
    .field-input:focus { border-color: var(--accent); }
    .field-input::placeholder { color: #bbb5ae; }
    .login-btn { width: 100%; padding: 14px; background: var(--accent); color: #fff; border: none; border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: background 0.2s, transform 0.1s; }
    .login-btn:hover { background: #b8441a; transform: translateY(-1px); }
    .auth-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; }

    /* HEADER */
    .header { background: var(--dark); height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 50; width: 100%; }
    .header-brand { display: flex; align-items: center; gap: 10px; }
    .header-icon { width: 32px; height: 32px; background: var(--accent); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
    .header-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .header-nav { display: flex; gap: 4px; }
    .nav-btn { padding: 7px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; background: transparent; border: none; color: #9a9088; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
    .nav-btn:hover { color: #fff; background: #ffffff10; }
    .nav-btn.active { color: #fff; background: var(--accent); }
    .header-user { display: flex; align-items: center; gap: 12px; }
    .user-email { font-size: 13px; color: #9a9088; }
    .signout-btn { padding: 7px 14px; background: transparent; border: 1px solid #3a3530; color: #9a9088; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
    .signout-btn:hover { border-color: #6a6058; color: #fff; }

    /* MAIN */
    .main { max-width: 1200px; margin: 0 auto; padding: 48px 32px; }
    .page-label { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
    .page-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--dark); letter-spacing: -0.03em; margin-bottom: 6px; }
    .page-sub { font-size: 15px; color: var(--muted); margin-bottom: 40px; }

    /* STATS */
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
    .stat-card { background: var(--card); border-radius: 14px; padding: 28px; border: 1px solid var(--border); transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
    .stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
    .stat-value { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; color: var(--accent); line-height: 1; margin-bottom: 6px; }
    .stat-desc { font-size: 13px; color: var(--muted); }

    /* SECTION */
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .section-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--dark); }

    /* CATEGORY PILLS */
    .cat-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
    .cat-pill { padding: 7px 16px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; border: 1.5px solid var(--border); background: var(--card); color: var(--muted); cursor: pointer; transition: all 0.2s; }
    .cat-pill:hover { border-color: var(--accent); color: var(--accent); }
    .cat-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }

    /* COURSE CARDS */
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .course-card { background: var(--card); border-radius: 16px; padding: 28px; border: 1px solid var(--border); cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
    .course-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transform: scaleX(0); transition: transform 0.3s; transform-origin: left; }
    .course-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: transparent; }
    .course-card:hover::after { transform: scaleX(1); }
    .course-emoji { font-size: 36px; margin-bottom: 16px; display: block; }
    .course-cat { font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
    .course-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--dark); line-height: 1.3; margin-bottom: 10px; }
    .course-desc { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
    .course-meta { display: flex; align-items: center; gap: 16px; }
    .course-meta-item { font-size: 12px; color: var(--muted); }
    .course-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 500; margin-left: auto; }
    .badge-published { background: #dcfce7; color: #166534; }
    .badge-draft { background: #fef3c7; color: #92400e; }

    /* MODAL */
    .modal-overlay { position: fixed; inset: 0; background: rgba(26,23,20,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(6px); padding: 20px; }
    .modal { background: var(--card); border-radius: 20px; width: 560px; max-width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
    .modal-header { padding: 32px 32px 0; }
    .modal-body { padding: 24px 32px 32px; }
    .modal-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; background: var(--bg2); border: none; border-radius: 50%; font-size: 18px; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
    .modal-close:hover { background: var(--border); }
    .modal-emoji { font-size: 48px; margin-bottom: 16px; display: block; }
    .modal-cat { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
    .modal-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: var(--dark); margin-bottom: 12px; }
    .modal-desc { font-size: 14px; color: var(--muted); line-height: 1.8; }
    .modal-divider { height: 1px; background: var(--border); margin: 24px 0; }
    .modal-stats { display: flex; gap: 32px; margin-bottom: 28px; }
    .modal-stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
    .modal-stat-value { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: var(--accent); }
    .start-btn { display: block; width: 100%; padding: 15px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; text-align: center; text-decoration: none; transition: background 0.2s, transform 0.1s; }
    .start-btn:hover { background: #b8441a; transform: translateY(-1px); }

    /* EMPTY */
    .empty { text-align: center; padding: 80px 20px; color: var(--muted); }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
    .loading { text-align: center; padding: 80px; color: var(--muted); font-size: 14px; letter-spacing: 0.06em; }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .login-page { grid-template-columns: 1fr; }
      .login-left { display: none; }
      .login-right { padding: 40px 24px; }
      .header { padding: 0 20px; }
      .user-email { display: none; }
      .main { padding: 32px 20px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .page-title { font-size: 28px; }
      .login-headline { font-size: 36px; }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: 1fr; }
      .courses-grid { grid-template-columns: 1fr; }
    }
  `;

  if (!session) return (
    <div className="page">
      <style>{CSS}</style>
      <div className="login-page">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-icon">⚡</div>
            <span className="login-brand-name">TrainCore</span>
          </div>
          <h1 className="login-headline">Learn.<br />Grow.<br />Excel.</h1>
          <p className="login-sub">Your company training hub. Access safety courses, certifications, and onboarding materials all in one place.</p>
        </div>
        <div className="login-right">
          <div className="login-form">
            <h2>Welcome back</h2>
            <p>Sign in to access your training dashboard</p>
            {authError && <div className="auth-error">{authError}</div>}
            <label className="field-label">Email Address</label>
            <input className="field-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            <label className="field-label">Password</label>
            <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            <button className="login-btn" onClick={handleLogin}>Sign In →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <style>{CSS}</style>

      <header className="header">
        <div className="header-brand">
          <div className="header-icon">⚡</div>
          <span className="header-name">TrainCore</span>
        </div>
        <nav className="header-nav">
          {["dashboard", "courses"].map(tab => (
            <button key={tab} className={`nav-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
          ))}
        </nav>
        <div className="header-user">
          <span className="user-email">{session.user.email}</span>
          <button className="signout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <main className="main">
        {loading ? (
          <div className="loading">Loading your courses...</div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <div>
                <p className="page-label">Overview</p>
                <h1 className="page-title">Training Dashboard</h1>
                <p className="page-sub">Track your team's progress and access all training materials.</p>
                <div className="stats-grid">
                  {[
                    { label: "Total Courses", value: courses.length, desc: "in your library" },
                    { label: "Published", value: courses.filter(c => c.is_published).length, desc: "available to team" },
                    { label: "Categories", value: [...new Set(courses.map(c => c.category).filter(Boolean))].length, desc: "training areas" },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <p className="stat-label">{s.label}</p>
                      <p className="stat-value">{s.value}</p>
                      <p className="stat-desc">{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="section-header">
                  <p className="section-title">Featured Courses</p>
                </div>
                {courses.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📚</div>
                    <p className="empty-title">No courses yet</p>
                    <p>Add courses in your Supabase dashboard to get started.</p>
                  </div>
                ) : (
                  <div className="courses-grid">
                    {courses.slice(0, 3).map(course => (
                      <CourseCard key={course.id} course={course} onOpen={setSelectedCourse} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div>
                <p className="page-label">Library</p>
                <h1 className="page-title">All Courses</h1>
                <p className="page-sub">{courses.length} courses across {[...new Set(courses.map(c => c.category).filter(Boolean))].length} categories.</p>
                <div className="cat-pills">
                  {categories.map(cat => (
                    <button key={cat} className={`cat-pill ${selectedCategory === cat ? "active" : ""}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
                  ))}
                </div>
                {filtered.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🔍</div>
                    <p className="empty-title">No courses found</p>
                    <p>Try selecting a different category.</p>
                  </div>
                ) : (
                  <div className="courses-grid">
                    {filtered.map(course => (
                      <CourseCard key={course.id} course={course} onOpen={setSelectedCourse} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-close" onClick={() => setSelectedCourse(null)}>×</button>
              <span className="modal-emoji">{selectedCourse.thumbnail_emoji || "📚"}</span>
              <p className="modal-cat">{selectedCourse.category}</p>
              <h2 className="modal-title">{selectedCourse.title}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-desc">{selectedCourse.description}</p>
              <div className="modal-divider" />
              <div className="modal-stats">
                {[["Duration", selectedCourse.duration], ["Lessons", selectedCourse.lesson_count]].map(([k, v]) => (
                  <div key={k}>
                    <p className="modal-stat-label">{k}</p>
                    <p className="modal-stat-value">{v || "—"}</p>
                  </div>
                ))}
              </div>
              {selectedCourse.video_url ? (
                <a href={selectedCourse.video_url} target="_blank" rel="noreferrer" className="start-btn">Start Course →</a>
              ) : (
                <button className="start-btn" style={{ opacity: 0.5, cursor: "not-allowed" }}>No Video Available</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onOpen }) {
  return (
    <div className="course-card" onClick={() => onOpen(course)}>
      <span className="course-emoji">{course.thumbnail_emoji || "📚"}</span>
      <p className="course-cat">{course.category}</p>
      <p className="course-title">{course.title}</p>
      <p className="course-desc">{course.description}</p>
      <div className="course-meta">
        <span className="course-meta-item">🕐 {course.duration || "—"}</span>
        <span className="course-meta-item">📖 {course.lesson_count || 0} lessons</span>
        <span className={`course-badge ${course.is_published ? "badge-published" : "badge-draft"}`}>
          {course.is_published ? "Live" : "Draft"}
        </span>
      </div>
    </div>
  );
}
