import React, { useState, useEffect, useRef } from "react";

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "Understanding COLREGS Rule 5: Look-out at All Times",
    category: "COLREGS",
    tags: ["watchkeeping", "collision prevention", "bridge team"],
    date: "April 15, 2026",
    readTime: 5,
    excerpt: "Rule 5 is one of the most cited rules in collision cases. This article breaks down what constitutes a proper look-out and common failures observed during navigation audits.",
    hook: "80% of maritime collisions are attributed to human error — and failure to maintain a proper look-out is the single most cited contributing factor in collision investigations worldwide.",
    content: `Rule 5 of the COLREGS requires every vessel to maintain a proper look-out at all times by sight, hearing, and all available means appropriate to the prevailing circumstances and conditions. Despite its simplicity, it remains one of the most frequently cited rules in marine accident investigations.\n\nWhat constitutes a proper look-out?\n\nA proper look-out is not merely the physical presence of a watchkeeper on the bridge. It encompasses active visual scanning of the horizon and nearby waters, monitoring of radar at appropriate range scales, listening on VHF channels 16 and relevant working channels, and use of AIS to track vessel movements and intentions.\n\nCommon failures observed during audits\n\nDuring navigation audits, the following deficiencies are routinely identified: Officer of the Watch distracted by administrative duties, radar not set to a near-range scale in restricted visibility, no dedicated look-out posted during nighttime transits in busy waters, and AIS targets not being cross-checked against radar.\n\nEstablishing a culture of disciplined watchkeeping begins with clear standing orders and regular refresher training.`,
    coverColor: "#1e3a5f"
  },
  {
    id: 2,
    title: "VDR Data Analysis: What Bridge Recordings Reveal About Navigation Quality",
    category: "VDR",
    tags: ["VDR", "audit", "data analysis"],
    date: "April 10, 2026",
    readTime: 7,
    excerpt: "Voyage Data Recorders hold a wealth of information beyond accident investigation. Learn how periodic VDR reviews can proactively improve bridge team performance.",
    hook: "In over 70% of serious marine casualties, the VDR contained clear evidence of the developing hazard — yet no corrective action was taken. The data was there. Nobody was watching it.",
    content: `The Voyage Data Recorder (VDR) is commonly associated with accident investigation — but its value as a proactive safety tool is often underutilized. Regular analysis of VDR data can surface dangerous trends before they result in incidents.\n\nWhat data does a VDR capture?\n\nModern VDRs record a comprehensive picture of bridge operations including radar images, bridge audio, AIS data, heading, speed, rudder angle, engine telegraph, and alarm states.\n\nUsing VDR for navigation audits\n\nBy analyzing VDR snapshots during port approaches and restricted water transits, superintendents can assess whether passage plans were being followed, quality of radar plotting and target tracking, bridge communication effectiveness, and alarm acknowledgement behaviour.\n\nKey indicators of poor navigation quality\n\nWatch for patterns such as frequent speed deviations from passage plan, late alter-course execution, and unacknowledged navigation alarms — all visible in the VDR data trail.`,
    coverColor: "#0f4c75"
  },
  {
    id: 3,
    title: "Passage Planning in Congested Waters: A Structured Approach",
    category: "Bridge Procedures",
    tags: ["passage planning", "ECDIS", "congested waters"],
    date: "April 2, 2026",
    readTime: 6,
    excerpt: "Effective passage planning in high-traffic areas requires more than waypoints on a chart. This article outlines a structured framework for planning transits through congested waters.",
    hook: "The Malacca Strait alone handles over 90,000 vessel transits per year — roughly one every six minutes. Yet studies show that nearly 1 in 3 passage plans reviewed during PSC inspections contain critical omissions.",
    content: `Passage planning in congested waters demands a higher standard of preparation than open sea transits. The stakes are greater, the margins are tighter, and the consequences of poor planning are more immediate.\n\nThe four stages of passage planning\n\nThe IMO Guidelines on Voyage Planning outline four stages: Appraisal, Planning, Execution, and Monitoring. Each stage carries specific responsibilities for both the Master and OOW.\n\nCritical elements for congested water planning\n\nWhen preparing for transits through areas like TSS corridors, port approaches, or straits, ensure your plan addresses no-go areas clearly marked on ECDIS, abort points with contingency anchoring options, tidal stream data and under-keel clearance calculations, and pre-arranged VTS reporting and pilot boarding arrangements.\n\nCommon planning gaps\n\nAudits frequently reveal missing contingency plans, outdated chart corrections, and passage plans that have not been reviewed and signed by the Master prior to departure.`,
    coverColor: "#163d5e"
  }
];

const CATEGORIES = ["All", "COLREGS", "VDR", "Bridge Procedures", "ECDIS", "Watchkeeping"];
const catColor = (cat) => ({
  COLREGS: { bg: "#e6f1fb", text: "#185fa5" },
  VDR: { bg: "#e1f5ee", text: "#0f6e56" },
  "Bridge Procedures": { bg: "#faeeda", text: "#854f0b" },
  ECDIS: { bg: "#eeedfe", text: "#534ab7" },
  Watchkeeping: { bg: "#faece7", text: "#993c1d" }
}[cat] || { bg: "#f1efe8", text: "#5f5e5a" });

function useStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
    catch { return fallback; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, set];
}

function HookBanner({ hook, loading }) {
  return (
    <div style={{
      margin: "0 0 28px",
      padding: "18px 22px",
      borderLeft: "3px solid #1e3a5f",
      background: "linear-gradient(90deg, rgba(30,58,95,0.06) 0%, transparent 100%)",
      borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0",
      position: "relative",
      minHeight: 56
    }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: "#1e3a5f", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Did you know</div>
      {loading ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#1e3a5f", opacity: 0.3, animation: `pulse 1.2s ${i*0.2}s infinite` }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:0.2}50%{opacity:0.8}}`}</style>
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--color-text-primary)", fontStyle: "italic" }}>{hook}</p>
      )}
    </div>
  );
}

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0);
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, height: 3, background: "var(--color-border-tertiary)", marginBottom: 24 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "#1e3a5f", transition: "width 0.15s" }} />
    </div>
  );
}

function AIDraftPanel({ onInsert, onClose }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setErr(""); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a maritime navigation expert and technical writer. Write educational blog articles for maritime professionals. Respond ONLY with a JSON object — no markdown fences, no preamble. Format: {"title":"...","category":"...","tags":["..."],"excerpt":"...","hook":"...","content":"..."}. Category must be one of: COLREGS, VDR, Bridge Procedures, ECDIS, Watchkeeping. Tags: 2-4 short relevant tags. hook: one surprising, specific statistic or striking fact (1-2 sentences) that will stop a maritime professional mid-scroll and make them want to read more — use real figures where possible, be concrete and specific. Content: 3-5 paragraphs separated by \\n\\n.`,
          messages: [{ role: "user", content: `Write a navigation & safety blog article about: ${topic}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
    } catch { setErr("Could not generate article. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-lg)", padding: "18px", background: "var(--color-background-secondary)", marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>AI article assistant</div>
        <button onClick={onClose} style={{ fontSize: 12, color: "var(--color-text-tertiary)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && generate()} placeholder="e.g. ECDIS alarm management best practices" style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
        <button onClick={generate} disabled={loading || !topic.trim()} style={{ padding: "8px 16px", fontSize: 13, background: loading ? "var(--color-background-secondary)" : "#1e3a5f", color: loading ? "var(--color-text-tertiary)" : "white", border: "none", borderRadius: "var(--border-radius-md)", cursor: loading ? "default" : "pointer" }}>{loading ? "Generating…" : "Generate"}</button>
      </div>
      {err && <div style={{ fontSize: 12, color: "var(--color-text-danger)", marginBottom: 8 }}>{err}</div>}
      {result && (
        <div style={{ marginTop: 12 }}>
          {result.hook && (
            <div style={{ padding: "10px 14px", borderLeft: "3px solid #1e3a5f", background: "rgba(30,58,95,0.05)", borderRadius: "0 6px 6px 0", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Hook stat preview</div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, fontStyle: "italic", color: "var(--color-text-secondary)" }}>{result.hook}</p>
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{result.title}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10, lineHeight: 1.6 }}>{result.excerpt}</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
            {(result.tags || []).map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#e6f1fb", color: "#185fa5" }}>#{t}</span>)}
          </div>
          <button onClick={() => { onInsert(result); setResult(null); setTopic(""); }} style={{ fontSize: 12, padding: "7px 16px", background: "#1e3a5f", color: "white", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Use this draft →</button>
        </div>
      )}
    </div>
  );
}

// Hook card shown on article listing
function HookCard({ post, onClick, isRead }) {
  const cc = catColor(post.category);
  return (
    <div onClick={onClick} style={{ cursor: "pointer", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)", transition: "border-color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-primary)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}>
      {/* Hook strip */}
      {post.hook && (
        <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "12px 16px", background: "rgba(30,58,95,0.04)", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#1e3a5f" strokeWidth="1.2"/><path d="M8 5v3.5M8 11v0.5" stroke="#1e3a5f" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: "#1e3a5f", fontStyle: "italic" }}>{post.hook}</p>
        </div>
      )}
      {/* Article body */}
      <div style={{ padding: "13px 16px" }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, background: cc.bg, color: cc.text }}>{post.category}</span>
          {isRead && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#eaf3de", color: "#3b6d11" }}>Read</span>}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: 6 }}>{post.title}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>{post.excerpt.substring(0, 110)}…</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
          {(post.tags || []).map(t => <span key={t} style={{ fontSize: 10, padding: "1px 7px", borderRadius: 20, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>#{t}</span>)}
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{post.date} · {post.readTime} min read</div>
      </div>
    </div>
  );
}

export default function NavSafetyBlog() {
  const [posts, setPosts] = useStorage("navsafety_posts_v2", DEFAULT_POSTS);
  const [readPosts, setReadPosts] = useStorage("navsafety_read", []);
  const [view, setView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ title: "", category: "COLREGS", tags: "", excerpt: "", hook: "", content: "" });
  const [showAI, setShowAI] = useState(false);
  const [generatingHook, setGeneratingHook] = useState(false);
  const [toast, setToast] = useState("");
  const [authed, setAuthed] = useState(false);
  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const ADMIN_PW = "navsafety2026";

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const allTags = [...new Set(posts.flatMap(p => p.tags || []))];
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchTag = !activeTag || (p.tags || []).includes(activeTag);
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchTag && matchSearch;
  });

  async function generateHookForDraft() {
    if (!draft.title.trim()) { showToast("Add a title first so AI can generate a relevant hook."); return; }
    setGeneratingHook(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: "You are a maritime safety expert. Return ONLY a single surprising, specific statistic or striking fact (1-2 sentences) relevant to the given article title — no preamble, no quotes, no explanation. Make it concrete, specific, and designed to stop a maritime professional mid-scroll.",
          messages: [{ role: "user", content: `Article title: ${draft.title}` }]
        })
      });
      const data = await res.json();
      const hook = data.content?.find(b => b.type === "text")?.text?.trim() || "";
      if (hook) setDraft(d => ({ ...d, hook }));
    } catch { showToast("Could not generate hook. Try again."); }
    setGeneratingHook(false);
  }

  function openPost(post) {
    setSelectedPost(post);
    setView("post");
    if (!readPosts.includes(post.id)) setReadPosts(prev => [...prev, post.id]);
  }

  function publishPost() {
    if (!draft.title.trim() || !draft.content.trim()) { showToast("Title and content are required."); return; }
    const newPost = {
      id: Date.now(),
      title: draft.title,
      category: draft.category,
      tags: draft.tags ? draft.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      readTime: Math.max(1, Math.round(draft.content.split(" ").length / 200)),
      excerpt: draft.excerpt || draft.content.substring(0, 150) + "...",
      hook: draft.hook,
      content: draft.content,
      coverColor: "#1e3a5f"
    };
    setPosts(prev => [newPost, ...prev]);
    setDraft({ title: "", category: "COLREGS", tags: "", excerpt: "", hook: "", content: "" });
    setShowAI(false);
    showToast("Article published.");
    setView("home");
  }

  function deletePost(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
    setView("home");
    showToast("Article deleted.");
  }

  function injectDraft(result) {
    setDraft({
      title: result.title || "",
      category: result.category || "COLREGS",
      tags: (result.tags || []).join(", "),
      excerpt: result.excerpt || "",
      hook: result.hook || "",
      content: result.content || ""
    });
    setShowAI(false);
    showToast("Draft loaded — review and publish when ready.");
  }

  const readCount = readPosts.length;
  const totalCount = posts.length;
  const [featured, ...rest] = filtered;

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", maxWidth: 860, margin: "0 auto", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "18px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setView("home")}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/><path d="M12 3L12 21M3 12L21 12" stroke="white" strokeWidth="1.5"/><path d="M12 3C7 8 7 16 12 21C17 16 17 8 12 3Z" fill="white" fillOpacity="0.2"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>NavSafety Blog</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Navigation & Safety Insights</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", borderLeft: "0.5px solid var(--color-border-tertiary)", paddingLeft: 12 }}>Capt. Nabo Ghosh</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginRight: 2 }}>{readCount}/{totalCount} read</div>
          {["home","about"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ fontSize: 13, padding: "6px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: view === v ? "var(--color-background-secondary)" : "transparent", cursor: "pointer", color: "var(--color-text-primary)", textTransform: "capitalize" }}>{v === "home" ? "Articles" : "About"}</button>
          ))}
          <button onClick={() => { if (authed) { setView("editor"); } else { setShowPwPrompt(true); setPwError(false); setPwInput(""); } }} style={{ fontSize: 13, padding: "6px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid #1e3a5f", background: "#1e3a5f", cursor: "pointer", color: "white" }}>+ Write</button>
        </div>
      </div>

      {showPwPrompt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", padding: "28px 28px 24px", width: 320, border: "0.5px solid var(--color-border-secondary)" }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>Author access</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 16 }}>Enter your password to write and publish articles.</div>
            <input autoFocus type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }} onKeyDown={e => { if (e.key === "Enter") { if (pwInput === ADMIN_PW) { setAuthed(true); setShowPwPrompt(false); setView("editor"); } else { setPwError(true); } } }} placeholder="Password" style={{ width: "100%", fontSize: 13, padding: "9px 12px", border: `0.5px solid ${pwError ? "var(--color-border-danger)" : "var(--color-border-secondary)"}`, borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box", marginBottom: 6 }} />
            {pwError && <div style={{ fontSize: 12, color: "var(--color-text-danger)", marginBottom: 10 }}>Incorrect password.</div>}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => { if (pwInput === ADMIN_PW) { setAuthed(true); setShowPwPrompt(false); setView("editor"); } else { setPwError(true); } }} style={{ flex: 1, padding: "8px", fontSize: 13, background: "#1e3a5f", color: "white", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Enter</button>
              <button onClick={() => setShowPwPrompt(false)} style={{ flex: 1, padding: "8px", fontSize: 13, background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{ margin: "12px 0 0", padding: "10px 14px", background: "var(--color-background-success)", color: "var(--color-text-success)", borderRadius: "var(--border-radius-md)", fontSize: 13, border: "0.5px solid var(--color-border-success)" }}>{toast}</div>}

      {/* HOME */}
      {view === "home" && (
        <div style={{ marginTop: 24 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
            {[{ label: "Total articles", val: totalCount }, { label: "Articles read", val: readCount }, { label: "Categories", val: CATEGORIES.length - 1 }].map(s => (
              <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Featured */}
          {featured && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Featured</div>
              {featured.hook && (
                <div style={{ padding: "14px 18px", borderLeft: "3px solid #1e3a5f", background: "rgba(30,58,95,0.05)", borderRadius: "0 var(--border-radius-md) var(--border-radius-md) 0", marginBottom: 14, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <svg style={{ flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#1e3a5f" strokeWidth="1.2"/><path d="M8 5v3.5M8 11v0.5" stroke="#1e3a5f" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#1e3a5f", fontStyle: "italic" }}>{featured.hook}</p>
                </div>
              )}
              <div onClick={() => openPost(featured)} style={{ cursor: "pointer", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", display: "flex" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-primary)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}>
                <div style={{ background: featured.coverColor, width: 140, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/><path d="M24 4L24 44M4 24L44 24" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/></svg>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 9px", borderRadius: 20, background: catColor(featured.category).bg, color: catColor(featured.category).text }}>{featured.category}</span>
                    {readPosts.includes(featured.id) && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#eaf3de", color: "#3b6d11" }}>Read</span>}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4, marginBottom: 8 }}>{featured.title}</div>
                  <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>{featured.excerpt}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{featured.date} · {featured.readTime} min read</div>
                </div>
              </div>
            </div>
          )}

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." style={{ flex: 1, minWidth: 160, fontSize: 13, padding: "7px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 20, border: "0.5px solid var(--color-border-secondary)", background: activeCategory === c ? "#1e3a5f" : "transparent", color: activeCategory === c ? "white" : "var(--color-text-secondary)", cursor: "pointer" }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
              {allTags.map(t => (
                <span key={t} onClick={() => setActiveTag(activeTag === t ? null : t)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: activeTag === t ? "#cecbf6" : "var(--color-background-secondary)", color: activeTag === t ? "#534ab7" : "var(--color-text-secondary)", cursor: "pointer", border: "0.5px solid var(--color-border-tertiary)" }}>#{t}</span>
              ))}
              {activeTag && <span onClick={() => setActiveTag(null)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, color: "var(--color-text-tertiary)", cursor: "pointer" }}>✕ clear</span>}
            </div>
          )}

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {rest.map(post => <HookCard key={post.id} post={post} onClick={() => openPost(post)} isRead={readPosts.includes(post.id)} />)}
            {filtered.length === 0 && <div style={{ gridColumn: "1/-1", padding: "40px 0", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 14 }}>No articles found.</div>}
          </div>
        </div>
      )}

      {/* POST VIEW */}
      {view === "post" && selectedPost && (
        <div style={{ marginTop: 24 }}>
          <ReadingProgress />
          <button onClick={() => setView("home")} style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 18 }}>← Back to articles</button>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: catColor(selectedPost.category).bg, color: catColor(selectedPost.category).text }}>{selectedPost.category}</span>
            {(selectedPost.tags || []).map(t => <span key={t} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)" }}>#{t}</span>)}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4, margin: "0 0 10px" }}>{selectedPost.title}</h1>
          <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 22, display: "flex", gap: 10, alignItems: "center" }}>
            <span>{selectedPost.date}</span>
            <span>·</span>
            <span>{selectedPost.readTime} min read</span>
            <span>·</span>
            <span style={{ color: "#1e3a5f", fontWeight: 500 }}>Capt. Nabo Ghosh</span>
          </div>

          {selectedPost.hook && <HookBanner hook={selectedPost.hook} loading={false} />}

          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 22 }}>
            {selectedPost.content.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--color-text-secondary)", margin: "0 0 16px" }}>{para}</p>
            ))}
          </div>
          <button onClick={() => deletePost(selectedPost.id)} style={{ marginTop: 24, fontSize: 12, color: "var(--color-text-danger)", background: "none", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "6px 14px", cursor: "pointer" }}>Delete article</button>
        </div>
      )}

      {/* EDITOR */}
      {view === "editor" && (
        <div style={{ marginTop: 24 }}>
          <button onClick={() => setView("home")} style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 18 }}>← Cancel</button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Write a new article</h2>
            <button onClick={() => setShowAI(!showAI)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: "var(--border-radius-md)", border: "0.5px solid #534ab7", background: showAI ? "#534ab7" : "transparent", color: showAI ? "white" : "#534ab7", cursor: "pointer" }}>✦ AI assistant</button>
          </div>
          {showAI && <AIDraftPanel onInsert={injectDraft} onClose={() => setShowAI(false)} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Title</label>
              <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Article title..." style={{ width: "100%", fontSize: 15, padding: "9px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Category</label>
                <select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} style={{ width: "100%", fontSize: 13, padding: "8px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Tags (comma-separated)</label>
                <input value={draft.tags} onChange={e => setDraft({ ...draft, tags: e.target.value })} placeholder="e.g. radar, bridge team" style={{ width: "100%", fontSize: 13, padding: "8px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Hook field */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Hook stat / surprising fact</label>
                <button onClick={generateHookForDraft} disabled={generatingHook} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, border: "0.5px solid #1e3a5f", background: "transparent", color: "#1e3a5f", cursor: generatingHook ? "default" : "pointer", opacity: generatingHook ? 0.5 : 1 }}>{generatingHook ? "Generating…" : "✦ Generate hook"}</button>
              </div>
              <textarea value={draft.hook} onChange={e => setDraft({ ...draft, hook: e.target.value })} placeholder="A striking stat or fact that stops the reader before they read the article..." rows={2} style={{ width: "100%", fontSize: 13, padding: "9px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
              {draft.hook && (
                <div style={{ marginTop: 6, padding: "8px 12px", borderLeft: "3px solid #1e3a5f", background: "rgba(30,58,95,0.04)", borderRadius: "0 6px 6px 0" }}>
                  <div style={{ fontSize: 10, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Preview</div>
                  <p style={{ margin: 0, fontSize: 12, fontStyle: "italic", color: "#1e3a5f", lineHeight: 1.6 }}>{draft.hook}</p>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Short excerpt (optional)</label>
              <input value={draft.excerpt} onChange={e => setDraft({ ...draft, excerpt: e.target.value })} placeholder="A brief summary shown on the listing page..." style={{ width: "100%", fontSize: 13, padding: "9px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>Content</label>
              <textarea value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} placeholder="Write your article here. Separate paragraphs with a blank line." rows={12} style={{ width: "100%", fontSize: 13, padding: "10px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={publishPost} style={{ padding: "9px 22px", fontSize: 13, background: "#1e3a5f", color: "white", border: "none", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontWeight: 500 }}>Publish article</button>
              <button onClick={() => setView("home")} style={{ padding: "9px 18px", fontSize: 13, background: "transparent", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Discard</button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {view === "about" && (
        <div style={{ marginTop: 32, maxWidth: 560 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="26" height="26" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="white" strokeOpacity="0.5" strokeWidth="1.5"/><path d="M24 4L24 44M4 24L44 24" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/></svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 12px" }}>About NavSafety Blog</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: "white" }}>NG</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Capt. Nabo Ghosh</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Navigation & Safety Professional · Maritime Fleet Standards</div>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: "0 0 14px" }}>NavSafety Blog is a resource for maritime professionals focused on navigation quality, bridge procedures, and safety standards.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)", margin: "0 0 14px" }}>Every article opens with a surprising statistic or striking fact — designed to engage your thinking before you read a single paragraph.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>The goal is simple: raise navigation quality across fleets through practical, accessible knowledge.</p>
          <div style={{ marginTop: 20, padding: "14px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)" }}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Your reading progress</div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{readCount} of {totalCount} articles read</div>
            <div style={{ height: 4, background: "var(--color-border-tertiary)", borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${totalCount ? Math.round((readCount / totalCount) * 100) : 0}%`, background: "#1e3a5f", borderRadius: 4 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
