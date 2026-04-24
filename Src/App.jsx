import { useState, useEffect } from "react";

const STORAGE_KEY = "garden-feeding-records";

const FEED_GROUPS = [
  {
    id: "blueberries",
    label: "Blueberries",
    feed: "Vitax Seaweed + Iron",
    intervalDays: 14,
    notes: "Priority — sequestered iron bypasses pH issues",
  },
  {
    id: "fruit-trees",
    label: "Fruit Trees & Stepover",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Apple, apricot, damson, cherry, plum, stepover",
  },
  {
    id: "fruiting-other",
    label: "Fig, Grape & Gooseberry",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "All actively fruiting / flowering plants",
  },
  {
    id: "strawberries",
    label: "Strawberries",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "In raised beds and pots",
  },
  {
    id: "recent-moves",
    label: "Recently Moved / Young Plants",
    feed: "Maxicrop Seaweed",
    intervalDays: 14,
    notes: "Euphorbia Bed B, hellebore, foxglove Bed H, sweet peas",
  },
  {
    id: "bed-a-perennials",
    label: "Bed A Perennials",
    feed: "Maxicrop Seaweed",
    intervalDays: 21,
    notes: "Delphiniums, hollyhocks, peonies — general tonic",
  },
  {
    id: "alstroemeria",
    label: "Alstroemeria (Peruvian Lily)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "High-potash feed every 2 weeks while flowering (late Apr–Sep)",
  },
  {
    id: "rhubarb",
    label: "Rhubarb",
    feed: "Fish, Blood & Bone",
    intervalDays: 28,
    notes: "Scatter around base (not on crown), scratch in and water. No harvesting this year — still establishing",
  },
  {
    id: "spinach",
    label: "Spinach",
    feed: "Fish, Blood & Bone",
    intervalDays: 28,
    notes: "Light application only — hold until after first harvests when it needs to push new growth",
  },
];

const pad = (n) => String(n).padStart(2, "0");
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const parseDate = (s) => new Date(s + "T00:00:00");
const formatDate = (s) => {
  if (!s) return "Never";
  const d = parseDate(s);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const daysBetween = (a, b) => Math.round((b - a) / 86400000);

function getDueStatus(lastFed, intervalDays) {
  if (!lastFed) return { label: "Never fed", color: "#c0392b", urgent: true };
  const last = parseDate(lastFed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSince = daysBetween(last, today);
  const daysUntil = intervalDays - daysSince;
  if (daysUntil <= 0) return { label: `Overdue by ${Math.abs(daysUntil)}d`, color: "#c0392b", urgent: true };
  if (daysUntil <= 3) return { label: `Due in ${daysUntil}d`, color: "#e67e22", urgent: true };
  return { label: `Due in ${daysUntil}d`, color: "#5a7a4a", urgent: false };
}

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

export default function App() {
  const [records, setRecords] = useState({});
  const [logDate, setLogDate] = useState(todayStr());
  const [logging, setLogging] = useState(null);
  const [view, setView] = useState("due");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const logFeeding = (groupId) => {
    const updated = {
      ...records,
      [groupId]: {
        lastFed: logDate,
        history: [...(records[groupId]?.history || []), logDate].slice(-10),
      },
    };
    setRecords(updated);
    saveRecords(updated);
    setLogging(null);
  };

  const clearRecord = (groupId) => {
    const updated = { ...records };
    delete updated[groupId];
    setRecords(updated);
    saveRecords(updated);
  };

  const urgentGroups = FEED_GROUPS.filter((g) => getDueStatus(records[g.id]?.lastFed, g.intervalDays).urgent);
  const okGroups = FEED_GROUPS.filter((g) => !getDueStatus(records[g.id]?.lastFed, g.intervalDays).urgent);
  const displayGroups = view === "due" ? [...urgentGroups, ...okGroups] : FEED_GROUPS;

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#f7f3ec",
      minHeight: "100vh",
      padding: "0",
      color: "#2c2416",
      maxWidth: 600,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{
        background: "#3a5a2a",
        padding: "20px 16px 14px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#a8c89a", textTransform: "uppercase", marginBottom: 2 }}>Devon Garden</div>
        <div style={{ fontSize: 22, color: "#f0ece4", fontWeight: "normal", letterSpacing: 0.5 }}>Feeding Tracker</div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", borderBottom: "1px solid #d4c9b5", background: "#f0ece4" }}>
        {[["due", "Due / Urgent"], ["all", "All Plants"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1,
            padding: "10px 0",
            border: "none",
            background: "none",
            fontFamily: "Georgia, serif",
            fontSize: 13,
            color: view === v ? "#3a5a2a" : "#7a6a58",
            borderBottom: view === v ? "2px solid #3a5a2a" : "2px solid transparent",
            cursor: "pointer",
            fontWeight: view === v ? "bold" : "normal",
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {/* Summary bar */}
      <div style={{
        background: urgentGroups.length > 0 ? "#fdf3e8" : "#edf5e9",
        borderBottom: "1px solid #d4c9b5",
        padding: "8px 16px",
        fontSize: 12,
        color: urgentGroups.length > 0 ? "#9a4a10" : "#3a5a2a",
      }}>
        {urgentGroups.length === 0
          ? "✓ All plants up to date"
          : `${urgentGroups.length} group${urgentGroups.length > 1 ? "s" : ""} need attention`}
      </div>

      {/* Cards */}
      <div style={{ padding: "12px 12px 80px" }}>
        {displayGroups.map((group) => {
          const rec = records[group.id];
          const status = getDueStatus(rec?.lastFed, group.intervalDays);
          const isLogging = logging === group.id;

          return (
            <div key={group.id} style={{
              background: "#fff",
              borderRadius: 8,
              marginBottom: 10,
              border: `1px solid ${status.urgent ? "#e8c9b0" : "#ddd5c5"}`,
              overflow: "hidden",
              boxShadow: status.urgent ? "0 1px 4px rgba(180,80,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <div style={{ padding: "12px 14px 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold", color: "#2c2416", marginBottom: 2 }}>{group.label}</div>
                    <div style={{ fontSize: 12, color: "#5a7a4a", fontStyle: "italic", marginBottom: 4 }}>{group.feed}</div>
                    <div style={{ fontSize: 11, color: "#8a7a68" }}>{group.notes}</div>
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: "bold",
                    color: status.color,
                    textAlign: "right",
                    minWidth: 80,
                    paddingLeft: 8,
                  }}>{status.label}</div>
                </div>
                <div style={{ fontSize: 11, color: "#9a8a78", marginTop: 6 }}>
                  Last fed: {formatDate(rec?.lastFed)} · Every {group.intervalDays} days
                </div>
              </div>

              {isLogging ? (
                <div style={{ background: "#f7f3ec", borderTop: "1px solid #e5ddd0", padding: "10px 14px" }}>
                  <div style={{ fontSize: 12, color: "#5a4a38", marginBottom: 6 }}>Date fed:</div>
                  <input
                    type="date"
                    value={logDate}
                    onChange={e => setLogDate(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #c5b8a5",
                      borderRadius: 5,
                      fontSize: 13,
                      fontFamily: "Georgia, serif",
                      background: "#fff",
                      color: "#2c2416",
                      marginRight: 8,
                    }}
                  />
                  <button onClick={() => logFeeding(group.id)} style={{
                    padding: "6px 14px",
                    background: "#3a5a2a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                    marginRight: 6,
                  }}>Save</button>
                  <button onClick={() => setLogging(null)} style={{
                    padding: "6px 10px",
                    background: "none",
                    color: "#7a6a58",
                    border: "1px solid #c5b8a5",
                    borderRadius: 5,
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                  }}>Cancel</button>
                </div>
              ) : (
                <div style={{ borderTop: "1px solid #ede5d8", padding: "8px 14px", display: "flex", gap: 8 }}>
                  <button onClick={() => { setLogging(group.id); setLogDate(todayStr()); }} style={{
                    padding: "5px 14px",
                    background: "#3a5a2a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                    cursor: "pointer",
                  }}>Log feeding</button>
                  {rec && (
                    <button onClick={() => clearRecord(group.id)} style={{
                      padding: "5px 10px",
                      background: "none",
                      color: "#a08070",
                      border: "1px solid #d4c9b5",
                      borderRadius: 5,
                      fontSize: 11,
                      fontFamily: "Georgia, serif",
                      cursor: "pointer",
                    }}>Clear</button>
                  )}
                  {rec?.history?.length > 1 && (
                    <div style={{ fontSize: 10, color: "#9a8a78", alignSelf: "center", marginLeft: "auto" }}>
                      {rec.history.length} feedings logged
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Apple reminder */}
      <div style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 576,
        background: "#3a5a2a",
        color: "#d0e8c8",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 11,
        lineHeight: 1.5,
      }}>
        <span style={{ color: "#f0ece4", fontWeight: "bold" }}>⚠ Reminder: </span>
        Fan-trained apple showing no signs of life — late April assessment due. Check above-graft viability before deciding on replacement.
      </div>
    </div>
  );
                  }
                  
