import { useState, useRef, useCallback } from "react";

const DEFAULT_ITEMS = [
  { ticker: "PZU", name: "Powszechny Zakład Ubezpieczeń SA", score: "+100", extra: "z 5 strategii" },
  { ticker: "PKN", name: "Polski Koncern Naftowy ORLEN SA", score: "+94", extra: "z 5 strategii" },
  { ticker: "OPL", name: "OrangePL", score: "+88", extra: "z 7 strategii" },
  { ticker: "MIL", name: "Bank Millennium S.A.", score: "+75", extra: "z 4 strategii" },
  { ticker: "PKO", name: "Powszechna Kasa Oszczędności Bank Polski SA", score: "+70", extra: "z 5 strategii" },
  { ticker: "TPE", name: "Tauron Polska Energia S.A.", score: "+65", extra: "z 6 strategii" },
  { ticker: "ZAB", name: "Żabka Group S.A.", score: "+60", extra: "z 2 strategii" },
  { ticker: "GTN", name: "Getin Holding SA", score: "+52", extra: "z 7 strategii" },
  { ticker: "PCO", name: "Pepco Group B.V.", score: "+49", extra: "z 8 strategii" },
  { ticker: "PGE", name: "PGE Polska Grupa Energetyczna SA", score: "+44", extra: "z 7 strategii" },
];

const THEMES = {
  midnight: {
    name: "Midnight Gold",
    bg: "linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)",
    accent: "#d4a843",
    accentLight: "rgba(212, 168, 67, 0.15)",
    text: "#e8e8e8",
    dimText: "#8b8b9a",
    muted: "#6b7280",
    scoreColor: "#4ade80",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(212, 168, 67, 0.2)",
    badgeBg: "rgba(212, 168, 67, 0.12)",
    numberBg: "rgba(212, 168, 67, 0.1)",
    blurBadge: "#d4a843",
    topRowBg: "rgba(212, 168, 67, 0.06)",
    topRowBorder: "rgba(212, 168, 67, 0.25)",
  },
  ocean: {
    name: "Deep Ocean",
    bg: "linear-gradient(145deg, #020617 0%, #0c1a3a 40%, #0f2847 100%)",
    accent: "#38bdf8",
    accentLight: "rgba(56, 189, 248, 0.12)",
    text: "#e2e8f0",
    dimText: "#7b8ba0",
    muted: "#64748b",
    scoreColor: "#4ade80",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(56, 189, 248, 0.2)",
    badgeBg: "rgba(56, 189, 248, 0.1)",
    numberBg: "rgba(56, 189, 248, 0.08)",
    blurBadge: "#38bdf8",
    topRowBg: "rgba(56, 189, 248, 0.05)",
    topRowBorder: "rgba(56, 189, 248, 0.25)",
  },
  ember: {
    name: "Ember",
    bg: "linear-gradient(145deg, #1a0a0a 0%, #2d1117 40%, #3b1520 100%)",
    accent: "#f97316",
    accentLight: "rgba(249, 115, 22, 0.12)",
    text: "#fde8d8",
    dimText: "#b09080",
    muted: "#9c7a6b",
    scoreColor: "#4ade80",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(249, 115, 22, 0.2)",
    badgeBg: "rgba(249, 115, 22, 0.1)",
    numberBg: "rgba(249, 115, 22, 0.08)",
    blurBadge: "#f97316",
    topRowBg: "rgba(249, 115, 22, 0.05)",
    topRowBorder: "rgba(249, 115, 22, 0.25)",
  },
  emerald: {
    name: "Emerald",
    bg: "linear-gradient(145deg, #021a0a 0%, #052e16 40%, #064e1e 100%)",
    accent: "#34d399",
    accentLight: "rgba(52, 211, 153, 0.12)",
    text: "#d1fae5",
    dimText: "#7baa90",
    muted: "#6b8f7b",
    scoreColor: "#fbbf24",
    cardBg: "rgba(255,255,255,0.03)",
    cardBorder: "rgba(52, 211, 153, 0.2)",
    badgeBg: "rgba(52, 211, 153, 0.1)",
    numberBg: "rgba(52, 211, 153, 0.08)",
    blurBadge: "#34d399",
    topRowBg: "rgba(52, 211, 153, 0.05)",
    topRowBorder: "rgba(52, 211, 153, 0.25)",
  },
  frost: {
    name: "Frost Light",
    bg: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 40%, #f1f5f9 100%)",
    accent: "#6366f1",
    accentLight: "rgba(99, 102, 241, 0.08)",
    text: "#1e293b",
    dimText: "#64748b",
    muted: "#94a3b8",
    scoreColor: "#16a34a",
    cardBg: "rgba(255,255,255,0.7)",
    cardBorder: "rgba(99, 102, 241, 0.2)",
    badgeBg: "rgba(99, 102, 241, 0.08)",
    numberBg: "rgba(99, 102, 241, 0.06)",
    blurBadge: "#6366f1",
    topRowBg: "rgba(99, 102, 241, 0.04)",
    topRowBorder: "rgba(99, 102, 241, 0.2)",
  },
};

const FONTS = {
  cabinet: { name: "DM + Sora", import: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Sora:wght@400;600;700&display=swap", heading: "'DM Serif Display', serif", body: "'Sora', sans-serif" },
  clash: { name: "Playfair + Space", import: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap", heading: "'Playfair Display', serif", body: "'Space Grotesk', sans-serif" },
  mono: { name: "JetBrains + Outfit", import: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;600;700&display=swap", heading: "'JetBrains Mono', monospace", body: "'Outfit', sans-serif" },
};

const RANK_ICONS = ["🥇", "🥈", "🥉"];

const FIELD_CONFIGS = [
  { key: "ticker", label: "Ticker / Main Label", placeholder: "e.g. AAPL", show: true },
  { key: "name", label: "Description / Subtitle", placeholder: "e.g. Apple Inc.", show: true },
  { key: "score", label: "Score / Value", placeholder: "e.g. +100", show: true },
  { key: "extra", label: "Extra Text", placeholder: "e.g. from 5 strategies", show: true },
];

export default function ListBlurer() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [blurred, setBlurred] = useState(new Set([5, 6, 7, 8, 9]));
  const [title, setTitle] = useState("Blue Chip (duży wolumen)");
  const [subtitle, setSubtitle] = useState("↗ KUP (10)");
  const [ctaText, setCtaText] = useState("🔓 Odblokuj pełną listę → naszportal.pl");
  const [brandName, setBrandName] = useState("StockPicks");
  const [themeKey, setThemeKey] = useState("midnight");
  const [fontKey, setFontKey] = useState("cabinet");
  const [showEditor, setShowEditor] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showFieldToggles, setShowFieldToggles] = useState(false);
  const [visibleFields, setVisibleFields] = useState({ ticker: true, name: true, score: true, extra: true });
  const [highlightTopN, setHighlightTopN] = useState(3);
  const [isExporting, setIsExporting] = useState(false);
  const [tab, setTab] = useState("items"); // "items" | "settings" | "fields"
  const previewRef = useRef(null);

  const theme = THEMES[themeKey];
  const font = FONTS[fontKey];

  const toggleBlur = (index) => {
    setBlurred((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const blurFromIndex = (startIdx) => {
    const next = new Set();
    items.forEach((_, i) => { if (i >= startIdx) next.add(i); });
    setBlurred(next);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setBlurred((prev) => {
      const next = new Set();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ticker: "", name: "", score: "", extra: "" }]);
    setEditingItem(items.length);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setItems(newItems);
    const newBlurred = new Set();
    blurred.forEach((i) => {
      if (i === index) newBlurred.add(newIndex);
      else if (i === newIndex) newBlurred.add(index);
      else newBlurred.add(i);
    });
    setBlurred(newBlurred);
  };

  const blurCount = blurred.size;
  const visibleCount = items.length - blurCount;

  const handleExport = useCallback(async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, backgroundColor: null, useCORS: true, logging: false,
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-list.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    }
    setIsExporting(false);
  }, [title]);

  const SmallBtn = ({ children, onClick, style, title: t }) => (
    <button onClick={onClick} title={t} style={{
      cursor: "pointer", border: "none", borderRadius: 5, fontFamily: font.body,
      transition: "all 0.15s ease", fontSize: 10, padding: "3px 7px",
      background: "rgba(255,255,255,0.06)", color: theme.muted, ...style,
    }}>
      {children}
    </button>
  );

  return (
    <>
      <link href={font.import} rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.accent}33; border-radius: 3px; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px ${theme.accent}15; }
          50% { box-shadow: 0 0 35px ${theme.accent}30; }
        }
        .list-item-row { animation: fadeInUp 0.35s ease both; }
        .blur-badge {
          background: linear-gradient(90deg, transparent, ${theme.accent}33, transparent);
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
        .preview-card { animation: pulseGlow 4s ease infinite; }
        input, textarea {
          font-family: ${font.body};
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 6px 10px;
          color: #e8e8e8;
          font-size: 12px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus { border-color: ${theme.accent}88; }
        .tab-btn {
          cursor: pointer; border: none; background: none; padding: 8px 14px;
          font-family: ${font.body}; font-size: 11px; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase; border-radius: 6px;
          transition: all 0.15s;
        }
        .tab-btn.active { background: ${theme.accent}22; color: ${theme.accent}; }
        .tab-btn:not(.active) { color: ${theme.muted}; }
        .tab-btn:hover:not(.active) { color: ${theme.text}; background: rgba(255,255,255,0.04); }
        .quick-blur-btn {
          cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
          padding: 4px 10px; border-radius: 14px; font-size: 10px; font-family: ${font.body};
          color: ${theme.muted}; transition: all 0.15s;
        }
        .quick-blur-btn:hover { border-color: ${theme.accent}44; color: ${theme.accent}; background: ${theme.accent}11; }
        .field-toggle {
          display: flex; align-items: center; gap: 8px; padding: 8px 10px;
          border-radius: 8px; background: rgba(255,255,255,0.02); cursor: pointer;
          transition: background 0.15s; border: 1px solid transparent;
        }
        .field-toggle:hover { background: rgba(255,255,255,0.04); }
        .field-toggle.on { border-color: ${theme.accent}33; }
        .toggle-track {
          width: 32px; height: 18px; border-radius: 9px; position: relative;
          transition: background 0.2s; flex-shrink: 0;
        }
        .toggle-track::after {
          content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%;
          background: white; top: 2px; transition: left 0.2s;
        }
        .toggle-track.on { background: ${theme.accent}; }
        .toggle-track.on::after { left: 16px; }
        .toggle-track.off { background: rgba(255,255,255,0.15); }
        .toggle-track.off::after { left: 2px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#0a0a0f", fontFamily: font.body, color: "#e8e8e8" }}>
        
        {/* Editor Panel */}
        <div style={{
          width: showEditor ? 400 : 0, minWidth: showEditor ? 400 : 0,
          overflow: "hidden", transition: "all 0.3s ease",
          borderRight: showEditor ? `1px solid ${theme.cardBorder}` : "none",
          background: "rgba(0,0,0,0.25)", height: "100vh", display: "flex", flexDirection: "column",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, padding: "12px 12px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
            <button className={`tab-btn ${tab === "items" ? "active" : ""}`} onClick={() => setTab("items")}>📋 Items</button>
            <button className={`tab-btn ${tab === "fields" ? "active" : ""}`} onClick={() => setTab("fields")}>⚙ Fields</button>
            <button className={`tab-btn ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>🎨 Style</button>
          </div>

          <div style={{ padding: "14px 14px", overflowY: "auto", flex: 1 }}>
            
            {/* ITEMS TAB */}
            {tab === "items" && (
              <div>
                {/* Quick blur controls */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Quick blur — hide from position:</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {[3, 4, 5, 6, 7].map((n) => (
                      <button key={n} className="quick-blur-btn" onClick={() => blurFromIndex(n)}>
                        Top {n} visible
                      </button>
                    ))}
                    <button className="quick-blur-btn" onClick={() => setBlurred(new Set())} style={{ color: "#4ade80" }}>
                      Show all
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {items.map((item, i) => {
                    const isEditing = editingItem === i;
                    const isBlur = blurred.has(i);
                    return (
                      <div key={i} style={{
                        padding: isEditing ? "10px" : "6px 8px",
                        borderRadius: 8,
                        background: isEditing ? "rgba(255,255,255,0.04)" : isBlur ? "rgba(255,255,255,0.01)" : "transparent",
                        border: isEditing ? `1px solid ${theme.accent}33` : "1px solid transparent",
                        transition: "all 0.15s",
                      }}>
                        {isEditing ? (
                          /* Expanded edit form */
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 9, color: theme.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Ticker</div>
                                <input value={item.ticker} onChange={(e) => updateItem(i, "ticker", e.target.value)} autoFocus />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 9, color: theme.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Score</div>
                                <input value={item.score} onChange={(e) => updateItem(i, "score", e.target.value)} />
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Description</div>
                              <input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
                            </div>
                            <div>
                              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>Extra text</div>
                              <input value={item.extra} onChange={(e) => updateItem(i, "extra", e.target.value)} />
                            </div>
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                              <SmallBtn onClick={() => removeItem(i)} style={{ background: "rgba(255,60,60,0.1)", color: "#f87171" }}>Delete</SmallBtn>
                              <SmallBtn onClick={() => setEditingItem(null)} style={{ background: `${theme.accent}22`, color: theme.accent }}>Done ✓</SmallBtn>
                            </div>
                          </div>
                        ) : (
                          /* Collapsed row */
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, color: theme.accent, fontWeight: 700, width: 20, textAlign: "center", flexShrink: 0, opacity: isBlur ? 0.3 : 1 }}>{i + 1}</span>
                            <div style={{ flex: 1, minWidth: 0, opacity: isBlur ? 0.4 : 1, cursor: "pointer" }} onClick={() => setEditingItem(i)}>
                              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.ticker || "(empty)"}</div>
                              {item.name && <div style={{ fontSize: 10, color: theme.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>}
                            </div>
                            {item.score && <span style={{ fontSize: 11, color: theme.scoreColor, fontWeight: 700, flexShrink: 0, opacity: isBlur ? 0.3 : 1 }}>{item.score}</span>}
                            <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                              <SmallBtn onClick={() => moveItem(i, -1)} title="Up">▲</SmallBtn>
                              <SmallBtn onClick={() => moveItem(i, 1)} title="Down">▼</SmallBtn>
                              <SmallBtn
                                onClick={() => toggleBlur(i)}
                                title={isBlur ? "Show" : "Blur"}
                                style={{
                                  background: isBlur ? `${theme.accent}22` : "rgba(255,255,255,0.06)",
                                  color: isBlur ? theme.accent : theme.muted,
                                  fontSize: 12, padding: "2px 6px",
                                }}
                              >
                                {isBlur ? "🔒" : "👁"}
                              </SmallBtn>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={addItem} style={{
                  marginTop: 10, width: "100%", padding: "10px", cursor: "pointer",
                  border: `1px dashed ${theme.accent}44`, borderRadius: 8,
                  background: "rgba(255,255,255,0.02)", color: theme.accent,
                  fontFamily: font.body, fontSize: 12, fontWeight: 600,
                }}>
                  + Add Item
                </button>
              </div>
            )}

            {/* FIELDS TAB */}
            {tab === "fields" && (
              <div>
                <p style={{ fontSize: 11, color: theme.muted, marginBottom: 14, lineHeight: 1.5 }}>
                  Toggle which fields are visible on the preview card. Hidden fields remain in your data.
                </p>
                {FIELD_CONFIGS.map((fc) => (
                  <div
                    key={fc.key}
                    className={`field-toggle ${visibleFields[fc.key] ? "on" : ""}`}
                    onClick={() => setVisibleFields((prev) => ({ ...prev, [fc.key]: !prev[fc.key] }))}
                    style={{ marginBottom: 6 }}
                  >
                    <div className={`toggle-track ${visibleFields[fc.key] ? "on" : "off"}`} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{fc.label}</div>
                      <div style={{ fontSize: 10, color: theme.muted }}>{fc.placeholder}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Highlight top rows</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 3, 5].map((n) => (
                      <button key={n} className="quick-blur-btn" onClick={() => setHighlightTopN(n)}
                        style={highlightTopN === n ? { borderColor: theme.accent, color: theme.accent, background: `${theme.accent}15` } : {}}>
                        {n === 0 ? "None" : `Top ${n}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {tab === "settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Theme</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {Object.entries(THEMES).map(([key, t]) => (
                      <div key={key} style={{
                        width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
                        background: t.accent,
                        border: themeKey === key ? "3px solid white" : "3px solid transparent",
                        boxShadow: themeKey === key ? `0 0 12px ${t.accent}66` : "none",
                        transition: "all 0.2s",
                      }} onClick={() => setThemeKey(key)} title={t.name} />
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: theme.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Font</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {Object.entries(FONTS).map(([key, f]) => (
                      <button key={key} className="quick-blur-btn" onClick={() => setFontKey(key)}
                        style={fontKey === key ? { borderColor: theme.accent, color: theme.accent, background: `${theme.accent}15` } : {}}>
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Title", value: title, set: setTitle },
                    { label: "Subtitle", value: subtitle, set: setSubtitle },
                    { label: "Brand", value: brandName, set: setBrandName },
                    { label: "CTA Text", value: ctaText, set: setCtaText },
                  ].map((f) => (
                    <div key={f.label}>
                      <div style={{ fontSize: 9, color: theme.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{f.label}</div>
                      <input value={f.value} onChange={(e) => f.set(e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div style={{ padding: "10px 14px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 6, background: "rgba(255,255,255,0.03)", fontSize: 11 }}>
                <span style={{ color: theme.accent, fontWeight: 700 }}>{visibleCount}</span> <span style={{ color: theme.muted }}>shown</span>
              </div>
              <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 6, background: "rgba(255,255,255,0.03)", fontSize: 11 }}>
                <span style={{ color: "#f87171", fontWeight: 700 }}>{blurCount}</span> <span style={{ color: theme.muted }}>hidden</span>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              style={{
                width: "100%", padding: "12px", fontSize: 13, fontWeight: 700,
                cursor: "pointer", border: "none", borderRadius: 8,
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}bb)`,
                color: "#000", fontFamily: font.body, letterSpacing: 0.5,
                transition: "all 0.15s",
              }}
            >
              {isExporting ? "⏳ Exporting..." : "📸 Export as PNG"}
            </button>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setShowEditor(!showEditor)}
          style={{
            position: "fixed", left: showEditor ? 389 : -1, top: 12, zIndex: 10,
            padding: "6px 10px", fontSize: 14, cursor: "pointer",
            background: "rgba(0,0,0,0.7)", color: theme.accent,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "0 8px 8px 0", fontFamily: font.body,
            transition: "left 0.3s ease",
          }}
        >
          {showEditor ? "◀" : "▶"}
        </button>

        {/* ====== PREVIEW ====== */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#111118", overflow: "auto", padding: 40 }}>
          <div
            ref={previewRef}
            className="preview-card"
            style={{
              width: 580, minHeight: 400, background: theme.bg,
              borderRadius: 20, padding: "32px 30px 24px",
              position: "relative", overflow: "hidden",
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            {/* Deco */}
            <div style={{ position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}0d, transparent)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -50, left: -50, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${theme.accent}08, transparent)`, pointerEvents: "none" }} />

            {/* Header */}
            <div style={{ position: "relative", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  {subtitle && (
                    <div style={{ fontSize: 12, fontFamily: font.body, fontWeight: 700, color: theme.scoreColor, letterSpacing: 1.5, marginBottom: 5 }}>
                      {subtitle}
                    </div>
                  )}
                  <h1 style={{ fontFamily: font.heading, fontSize: 26, fontWeight: 900, color: theme.text, lineHeight: 1.15 }}>
                    {title}
                  </h1>
                </div>
                {brandName && (
                  <div style={{
                    fontSize: 10, fontFamily: font.body, fontWeight: 700,
                    color: theme.accent, background: theme.badgeBg,
                    padding: "5px 12px", borderRadius: 20,
                    border: `1px solid ${theme.cardBorder}`, whiteSpace: "nowrap",
                  }}>
                    {brandName}
                  </div>
                )}
              </div>
              <div style={{ width: 45, height: 2.5, borderRadius: 2, background: `linear-gradient(90deg, ${theme.accent}, transparent)`, marginTop: 12 }} />
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
              {items.map((item, i) => {
                const isBlur = blurred.has(i);
                const isTop = i < highlightTopN;
                return (
                  <div
                    key={i}
                    className="list-item-row"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "9px 14px",
                      background: isTop ? theme.topRowBg : theme.cardBg,
                      borderRadius: 10,
                      border: `1px solid ${isTop ? theme.topRowBorder : isBlur ? "transparent" : theme.cardBorder}`,
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      width: 28, minWidth: 28, textAlign: "center",
                      fontFamily: font.heading, fontSize: isTop ? 16 : 14, fontWeight: 900,
                      color: isBlur ? "rgba(128,128,128,0.3)" : (isTop ? theme.accent : theme.dimText),
                      filter: isBlur ? "blur(3px)" : "none",
                    }}>
                      {isTop && !isBlur ? RANK_ICONS[i] || `${i + 1}.` : `${i + 1}.`}
                    </div>

                    {/* Ticker + Name */}
                    <div style={{ flex: 1, minWidth: 0, filter: isBlur ? "blur(8px)" : "none", userSelect: isBlur ? "none" : "auto", transition: "filter 0.3s" }}>
                      {visibleFields.ticker && (
                        <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, letterSpacing: 0.5 }}>
                          {item.ticker}
                        </div>
                      )}
                      {visibleFields.name && item.name && (
                        <div style={{ fontSize: 11, color: theme.dimText, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.name}
                        </div>
                      )}
                    </div>

                    {/* Score + Extra */}
                    {!isBlur && (visibleFields.score || visibleFields.extra) && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {visibleFields.score && item.score && (
                          <span style={{ fontSize: 15, fontWeight: 800, color: theme.scoreColor, letterSpacing: 0.3 }}>
                            {item.score}
                          </span>
                        )}
                        {visibleFields.extra && item.extra && (
                          <span style={{ fontSize: 10, color: theme.dimText, marginLeft: 6 }}>
                            {item.extra}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Blur overlay */}
                    {isBlur && (
                      <div className="blur-badge" style={{
                        position: "absolute", right: 14,
                        fontSize: 9, fontWeight: 700, letterSpacing: 1.2,
                        color: theme.blurBadge, textTransform: "uppercase",
                        padding: "3px 10px", borderRadius: 4,
                      }}>
                        🔒 Premium
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            {ctaText && blurCount > 0 && (
              <div style={{
                marginTop: 18, textAlign: "center",
                padding: "13px 20px", borderRadius: 12,
                background: theme.accentLight,
                border: `1px dashed ${theme.accent}44`,
              }}>
                <div style={{ fontFamily: font.body, fontSize: 13, fontWeight: 700, color: theme.accent, letterSpacing: 0.3 }}>
                  {ctaText}
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.3 }}>
              <span style={{ fontSize: 9, color: theme.muted }}>{brandName && `© ${brandName}`}</span>
              <span style={{ fontSize: 9, color: theme.muted }}>{items.length} picks · {blurCount} premium</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
