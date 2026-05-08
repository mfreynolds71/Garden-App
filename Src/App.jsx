import { useState, useEffect } from "react";

const STORAGE_KEY = "garden-feeding-records";

const FEED_GROUPS = [
  // === FRUIT TREES ===
  {
    id: "apricot-bed-c",
    label: "Apricot 'Flavorcot' (Bed C)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Fan-trained against west boundary fence. Established and settling well",
    quantity: "1 capful per 6L · 5L applied slowly at base within mound, trickle method · Avoid waterlogging",
  },
  {
    id: "apricot-bed-d",
    label: "Apricot 'Flavorcot' (Bed D)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Fan-trained against shed wall. Two branches selected for training. Settling well",
    quantity: "1 capful per 6L · 5L around base · Planted in mound — pour very slowly at stake to avoid runoff",
  },
  {
    id: "cherry",
    label: "Cherry 'Stella' (Orchard)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Young tree, dwarf rootstock. Mixed health — one branch possibly dead. Monitor closely",
    quantity: "1 capful per 6L · 1.5L within 50cm of trunk · Do not broadcast over meadow",
  },
  {
    id: "plum-duo",
    label: "Plum Duo (Orchard)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Planted winter 2025/26. Both branches leafing, one slightly ahead. Settling well",
    quantity: "1 capful per 6L · 1.5L within 50cm of trunk · Do not broadcast over meadow",
  },
  {
    id: "malus",
    label: "Malus 'Gorgeous' (Orchard)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Whip with two low horizontal branches (~20cm above ground). Flowers fading, fruit swelling. Shape needs thinking about",
    quantity: "1 capful per 6L · 1.5L within 50cm of trunk · Do not broadcast over meadow",
  },
  {
    id: "stepover-apple",
    label: "Stepover Apple (Patio)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Lots of green leaves, flowers fading, fruit swelling positively. One downward shoot to remove",
    quantity: "1 capful per 6L · 2–3L around base",
  },
  {
    id: "damson",
    label: "Damson Trees (Bed B)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Very established — 3m+ canopy spread. Fruits showing well. Low priority for feeding — self-sufficient from surrounding soil",
    quantity: "1 capful per 6L · 10L per tree in broad circle 50–100cm from trunk · Can skip if short on feed",
  },
  // === SOFT FRUIT / FRUITING ===
  {
    id: "gooseberry",
    label: "Gooseberry (Bed H)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Fan-trained against north-facing shed wall. Lots of deep green leaves. Small side shoots now developing",
    quantity: "1 capful per 6L · 2–3L at base",
  },
  {
    id: "fig",
    label: "Fig (Patio Pot)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Bought and potted last autumn. Good leaves developing. Turn pot regularly for even growth",
    quantity: "1 capful per 6L · 1.5L at base of pot",
  },
  {
    id: "grape",
    label: "Grape 'Boskoop Glory' (Patio)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Vine 1 modest in growth, too small to train to fence yet. Vine 2 longer, begun training with cane",
    quantity: "1 capful per 6L · 4–5L around base if in ground · 1.5L if in pot",
  },
  {
    id: "strawberries",
    label: "Strawberries (Raised Bed 1)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Fruit coming on most plants. Possibly slightly shaded by peas — will improve once peas removed mid-May",
    quantity: "1 capful per 6L · 0.5–1L per plant applied gently",
  },
  {
    id: "blueberries",
    label: "Blueberries (Raised Bed 1 + Patio Pot)",
    feed: "Vitax Seaweed + Iron",
    intervalDays: 14,
    notes: "PRIORITY — sequestered iron bypasses pH problems. 4 in sunken pots in raised bed + 1 in patio pot. Rainwater only",
    quantity: "1 capful per 4L · 8L can with 2 capfuls covers all 5 plants · 1.5L per plant poured slowly at base",
  },
  // === CLIMBERS ===
  {
    id: "jasmine",
    label: "Star Jasmine (Pergola)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "2 × Trachelospermum jasminoides at pergola posts. Start once visibly pushing new growth on wires (~mid-May). Strulch mulch around base still to do",
    quantity: "1 capful per 6L · 1–2L per plant at base · Fortnightly through summer",
  },
  {
    id: "honeysuckle-bed-b",
    label: "Honeysuckle (Bed B)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Second year, spreading across trellis well, flower buds showing. Actively growing — good time to start feeding",
    quantity: "1 capful per 6L · 2–3L at base",
  },
  {
    id: "clematis",
    label: "Clematis (Bed G)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "North-facing bed surrounded by holly. Feed fortnightly from now through summer to support flowering",
    quantity: "1 capful per 6L · 2–3L at base · Keep away from holly root zone",
  },
  {
    id: "sweet-peas",
    label: "Sweet Peas",
    feed: "Maxicrop Seaweed",
    intervalDays: 14,
    notes: "Planted out ~17 Apr. Switch to Tomorite fortnightly once visibly climbing (mid-May). The more you pick the more they flower",
    quantity: "Maxicrop: dilute per label · 1–2L per plant or cluster at base · Once on Tomorite: 1 capful per 6L, same volume",
  },
  // === ORNAMENTAL SHRUBS ===
  {
    id: "hydrangea",
    label: "Hydrangea (Bed B)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Lots of leaves and flower buds developing — exactly the right moment to start feeding. Fortnightly through summer",
    quantity: "1 capful per 6L · 2–3L around base",
  },
  {
    id: "beautyberry",
    label: "Beautyberry (Bed F)",
    feed: "Maxicrop Seaweed",
    intervalDays: 14,
    notes: "Planted last autumn, putting on new green growth. Young plant still establishing — Maxicrop tonic to support roots",
    quantity: "Dilute per label · Light drench at base · One or two applications only while establishing",
  },
  {
    id: "himalayan-honeysuckle",
    label: "Himalayan Honeysuckle (Bed C)",
    feed: "Maxicrop Seaweed",
    intervalDays: 365,
    notes: "Cut back hard each year. Apply one Maxicrop drench once new shoots reach 30–40cm. Annual task only",
    quantity: "Dilute per label · Good drench at base · One application per year only",
  },
  {
    id: "bay-tree",
    label: "Bay Tree (Bed C)",
    feed: "Maxicrop Seaweed",
    intervalDays: 365,
    notes: "Hard pruned spring 2026 — wait until new shoots have properly unfurled before feeding. Follow with light Fish Blood & Bone scatter. Annual only",
    quantity: "Maxicrop: dilute per label · Good drench at base once leaves open · Follow with 1–2 handfuls Fish Blood & Bone scratched in",
  },
  // === PERENNIALS ===
  {
    id: "peonies",
    label: "Peonies (Beds A & B)",
    feed: "Tomorite",
    intervalDays: 28,
    notes: "Feed while in bud — high potassium supports flower development. Feed again 6 weeks after flowering. Keep away from crown",
    quantity: "1 capful per 6L · 1–2L per plant around drip line, not at crown · Follow with small handful of Fish Blood & Bone scratched in carefully",
  },
  {
    id: "delphiniums-hollyhocks",
    label: "Delphiniums & Hollyhocks (Bed A)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Hungry plants moving into flowering season. Tomorite supports flower production. Keep well watered",
    quantity: "1 capful per 6L · 1–2L per plant at base · Fortnightly until flowering finished",
  },
  {
    id: "alstroemeria",
    label: "Alstroemeria — Peruvian Lily (Patio)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Few open flowers, more developing. Pull (don't cut) spent stems from base to trigger more flowers. Keep consistently moist",
    quantity: "1 capful per 6L · 1–2L per clump at base · Fortnightly late Apr–Sep",
  },
  {
    id: "agapanthus",
    label: "Agapanthus (Patio Pots)",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Split last year — re-establishing, may not flower this season. Start once visibly pushing new growth (~mid-May). Do not repot this year",
    quantity: "1 capful per 6L · 1–1.5L per pot · Fortnightly through summer until end of August",
  },
  {
    id: "nepeta",
    label: "Nepeta Six Hills Giant (Bed A)",
    feed: "Maxicrop Seaweed",
    intervalDays: 14,
    notes: "Mostly planted late Apr, two splits from last year. One Maxicrop drench after 2 weeks then leave alone. Lean soil suits nepeta",
    quantity: "Dilute per label · Light drench at base only · One application only — do not feed regularly",
  },
  {
    id: "fuchsias",
    label: "Fuchsias (Bed B)",
    feed: "Maxicrop Seaweed",
    intervalDays: 14,
    notes: "Planted out 24 Apr. First 2 weeks: no feed. Then Maxicrop to support establishment. Switch to Tomorite fortnightly once visibly putting on new growth",
    quantity: "Dilute per label · Light drench at base only · Don't feed until at least 2 weeks after planting",
  },
  // === PRODUCTIVE ===
  {
    id: "tomatoes",
    label: "Tomatoes — Sungold & Gardener's Delight",
    feed: "Tomorite",
    intervalDays: 14,
    notes: "Not planted out yet. Start Tomorite fortnightly once first flowers appear — not before. Currently on windowsill",
    quantity: "1 capful per 6L · 1–2L per plant at base once planted · Do not feed before first flowers",
  },
  {
    id: "rhubarb",
    label: "Rhubarb (Bed C)",
    feed: "Fish, Blood & Bone",
    intervalDays: 28,
    notes: "No harvesting this year — still establishing after autumn split and multiple moves. Feed around base not on crown",
    quantity: "2–3 handfuls scattered around base (not on crown) · Scratch lightly into soil · Water in well · Every 4–6 weeks",
  },
  {
    id: "spinach",
    label: "Spinach (Raised Bed 2)",
    feed: "Fish, Blood & Bone",
    intervalDays: 28,
    notes: "Hold until after first harvests when it needs to push new growth. Light application only",
    quantity: "1 handful per 0.6m² · Light scatter only · Scratch in and water · Don't overfeed",
  },
  {
    id: "cardoon",
    label: "Cardoon (Orchard)",
    feed: "Fish, Blood & Bone",
    intervalDays: 28,
    notes: "Flower spike forming — hungry plant about to put on major growth surge. Maxicrop drench also useful between feeds. Keep within mulch ring",
    quantity: "3–4 handfuls within mulched circle at base · Scratch in and water · Keep feed within mulch ring — avoid enriching surrounding meadow",
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

      <div style={{ padding: "12px 12px 24px" }}>
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
                    {group.quantity && (
                      <div style={{
                        fontSize: 11,
                        color: "#4a6a3a",
                        background: "#f0f5ec",
                        border: "1px solid #ccdfc0",
                        borderRadius: 4,
                        padding: "5px 8px",
                        marginTop: 6,
                        lineHeight: 1.5,
                      }}>
                        📏 {group.quantity}
                      </div>
                    )}
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
                  Last fed: {formatDate(rec?.lastFed)} · Every {group.intervalDays === 365 ? "year" : `${group.intervalDays} days`}
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
    </div>
  );
}
