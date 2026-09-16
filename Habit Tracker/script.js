// ---------- Storage ----------
const STORAGE_KEY = "momentum_habit_tracker_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt data */
  }
  return { habits: [], logs: {} };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentView = "today";
let editingHabitId = null;
let pendingDeleteId = null;

// ---------- Date helpers ----------
function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayStr() {
  return dateStr(new Date());
}
function addDays(d, n) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

// ---------- Habit helpers ----------
function isScheduled(habit, d) {
  const days = habit.days && habit.days.length ? habit.days : [0, 1, 2, 3, 4, 5, 6];
  return days.includes(d.getDay());
}
function getCount(habitId, ds) {
  return (state.logs[habitId] && state.logs[habitId][ds]) || 0;
}
function setCount(habitId, ds, count) {
  if (!state.logs[habitId]) state.logs[habitId] = {};
  if (count <= 0) delete state.logs[habitId][ds];
  else state.logs[habitId][ds] = count;
  saveState();
}
function isDone(habit, ds) {
  return getCount(habit.id, ds) >= habit.target;
}

// current streak: walk back from today, allow today to be incomplete (in progress) without breaking streak
function currentStreak(habit) {
  let streak = 0;
  let cursor = new Date();
  let skippedToday = false;
  for (let i = 0; i < 730; i++) {
    const ds = dateStr(cursor);
    if (isScheduled(habit, cursor)) {
      if (isDone(habit, ds)) {
        streak++;
      } else if (ds === todayStr() && !skippedToday) {
        skippedToday = true; // today not done yet, don't break the streak
      } else {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function longestStreak(habit) {
  const logs = state.logs[habit.id] || {};
  const doneDates = Object.keys(logs)
    .filter((ds) => logs[ds] >= habit.target)
    .sort();
  if (!doneDates.length) return 0;

  let best = 0;
  let run = 0;
  let prevScheduledDate = null;

  const first = new Date(doneDates[0]);
  const last = new Date(doneDates[doneDates.length - 1]);
  let cursor = new Date(first);

  while (cursor <= last) {
    if (isScheduled(habit, cursor)) {
      const ds = dateStr(cursor);
      if (logs[ds] >= habit.target) {
        run++;
        best = Math.max(best, run);
      } else {
        run = 0;
      }
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

function completionRate(habit, days = 30) {
  let scheduled = 0;
  let done = 0;
  let cursor = new Date();
  for (let i = 0; i < days; i++) {
    if (isScheduled(habit, cursor)) {
      scheduled++;
      if (isDone(habit, dateStr(cursor))) done++;
    }
    cursor = addDays(cursor, -1);
  }
  return scheduled ? Math.round((done / scheduled) * 100) : 0;
}

// ---------- DOM refs ----------
const el = (id) => document.getElementById(id);

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = el("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- Rendering ----------
function renderAll() {
  renderStats();
  renderToday();
  renderHabitsGrid();
  renderWeeklyChart();
  populateHeatmapSelect();
  renderHeatmap();
}

function renderStats() {
  const today = new Date();
  const scheduledToday = state.habits.filter((h) => isScheduled(h, today));
  const doneToday = scheduledToday.filter((h) => isDone(h, todayStr()));
  const pct = scheduledToday.length ? Math.round((doneToday.length / scheduledToday.length) * 100) : 0;

  el("todayPct").textContent = `${pct}%`;
  el("todayDetail").textContent = `${doneToday.length} of ${scheduledToday.length} habits complete`;

  const circumference = 2 * Math.PI * 52;
  const ring = el("todayRing");
  ring.style.strokeDasharray = `${circumference}`;
  ring.style.strokeDashoffset = `${circumference - (pct / 100) * circumference}`;

  const bestActive = state.habits.reduce((max, h) => Math.max(max, currentStreak(h)), 0);
  const bestEver = state.habits.reduce((max, h) => Math.max(max, longestStreak(h)), 0);
  const avgRate = state.habits.length
    ? Math.round(state.habits.reduce((sum, h) => sum + completionRate(h, 30), 0) / state.habits.length)
    : 0;

  el("currentStreakTop").textContent = bestActive;
  el("longestStreakTop").textContent = bestEver;
  el("completionRateTop").textContent = `${avgRate}%`;
}

function habitCardTemplate(habit, ds) {
  const count = getCount(habit.id, ds);
  const done = count >= habit.target;
  const streak = currentStreak(habit);
  const showStepper = habit.target > 1;

  return `
    <div class="habit-card" style="--accent-color:${habit.color}" data-id="${habit.id}">
      <div class="habit-icon">${habit.icon || "✅"}</div>
      <div class="habit-main">
        <h4>${escapeHtml(habit.name)}</h4>
        <div class="habit-meta">
          <span class="streak-badge">🔥 ${streak} day${streak === 1 ? "" : "s"}</span>
          <span>${habit.target > 1 ? `${count}/${habit.target} today` : scheduleLabel(habit)}</span>
        </div>
        ${habit.target > 1 ? `<div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (count / habit.target) * 100)}%"></div></div>` : ""}
      </div>
      <div class="habit-controls">
        ${
          showStepper
            ? `<button class="count-btn" data-action="dec">−</button>
               <span class="count-display">${count}</span>
               <button class="count-btn" data-action="inc">+</button>`
            : `<button class="check-btn ${done ? "done" : ""}" data-action="toggle">✓</button>`
        }
        <button class="edit-btn" data-action="edit" title="Edit habit">⋯</button>
      </div>
    </div>
  `;
}

function scheduleLabel(habit) {
  const days = habit.days && habit.days.length ? habit.days : [0, 1, 2, 3, 4, 5, 6];
  if (days.length === 7) return "Daily";
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days
    .slice()
    .sort()
    .map((d) => names[d])
    .join(", ");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderToday() {
  const today = new Date();
  const ds = todayStr();
  el("todayDate").textContent = today.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const scheduled = state.habits.filter((h) => isScheduled(h, today));
  const container = el("todayList");
  container.innerHTML = scheduled.map((h) => habitCardTemplate(h, ds)).join("");
  el("todayEmpty").hidden = scheduled.length > 0;
}

function renderHabitsGrid() {
  const container = el("habitGrid");
  if (!state.habits.length) {
    container.innerHTML = `<p style="color:var(--text-dim)">No habits yet. Create one to get started.</p>`;
    return;
  }
  container.innerHTML = state.habits
    .map((h) => {
      const rate = completionRate(h, 30);
      const best = longestStreak(h);
      return `
      <div class="habit-card" style="--accent-color:${h.color}" data-id="${h.id}">
        <div class="habit-icon">${h.icon || "✅"}</div>
        <div class="habit-main">
          <h4>${escapeHtml(h.name)}</h4>
          <div class="habit-meta">
            <span>${scheduleLabel(h)}</span>
            <span>🏆 ${best}d best</span>
            <span>${rate}% / 30d</span>
          </div>
          ${miniHeatmap(h)}
        </div>
        <div class="habit-controls">
          <button class="edit-btn" data-action="edit" title="Edit habit">⋯</button>
        </div>
      </div>`;
    })
    .join("");
}

function miniHeatmap(habit) {
  let cells = "";
  let cursor = addDays(new Date(), -13);
  for (let i = 0; i < 14; i++) {
    const ds = dateStr(cursor);
    const done = isDone(habit, ds);
    cells += `<span class="mini-cell" style="${done ? `background:${habit.color}` : ""}"></span>`;
    cursor = addDays(cursor, 1);
  }
  return `<div class="mini-heatmap">${cells}</div>`;
}

function renderWeeklyChart() {
  const container = el("weeklyChart");
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let html = "";
  let cursor = addDays(new Date(), -6);
  for (let i = 0; i < 7; i++) {
    const d = new Date(cursor);
    const ds = dateStr(d);
    const scheduled = state.habits.filter((h) => isScheduled(h, d));
    const done = scheduled.filter((h) => isDone(h, ds));
    const pct = scheduled.length ? Math.round((done.length / scheduled.length) * 100) : 0;
    html += `
      <div class="weekly-bar-wrap">
        <span class="weekly-bar-pct">${pct}%</span>
        <div class="weekly-bar" style="height:${Math.max(4, pct)}%"></div>
        <span class="weekly-bar-label">${names[d.getDay()]}</span>
      </div>`;
    cursor = addDays(cursor, 1);
  }
  container.innerHTML = html;
}

function populateHeatmapSelect() {
  const select = el("heatmapHabitSelect");
  const prev = select.value;
  select.innerHTML =
    `<option value="__all__">All Habits</option>` +
    state.habits.map((h) => `<option value="${h.id}">${escapeHtml(h.name)}</option>`).join("");
  if (prev && [...select.options].some((o) => o.value === prev)) select.value = prev;
}

function renderHeatmap() {
  const container = el("yearHeatmap");
  const selected = el("heatmapHabitSelect").value || "__all__";
  const days = 371;
  const start = addDays(new Date(), -(days - 1));
  // align start to a Sunday so rows line up as weekdays
  const aligned = addDays(start, -start.getDay());

  let html = "";
  let cursor = new Date(aligned);
  const end = new Date();
  while (cursor <= end) {
    const ds = dateStr(cursor);
    let level = 0;
    if (selected === "__all__") {
      const scheduled = state.habits.filter((h) => isScheduled(h, cursor));
      const done = scheduled.filter((h) => isDone(h, ds));
      if (scheduled.length) {
        const ratio = done.length / scheduled.length;
        level = ratio === 0 ? 0 : ratio < 0.34 ? 1 : ratio < 0.67 ? 2 : ratio < 1 ? 3 : 4;
      }
    } else {
      const habit = state.habits.find((h) => h.id === selected);
      if (habit && isScheduled(habit, cursor)) {
        level = isDone(habit, ds) ? 4 : 0;
      }
    }
    const future = cursor > end;
    html += `<div class="heatmap-cell ${future ? "" : `l${level}`}" title="${ds}"></div>`;
    cursor = addDays(cursor, 1);
  }
  container.innerHTML = html;
}

// ---------- Event delegation for habit actions ----------
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const card = btn.closest(".habit-card");
  if (!card) return;
  const habit = state.habits.find((h) => h.id === card.dataset.id);
  if (!habit) return;
  const ds = todayStr();
  const action = btn.dataset.action;

  if (action === "inc") {
    setCount(habit.id, ds, getCount(habit.id, ds) + 1);
    renderAll();
  } else if (action === "dec") {
    setCount(habit.id, ds, Math.max(0, getCount(habit.id, ds) - 1));
    renderAll();
  } else if (action === "toggle") {
    const done = isDone(habit, ds);
    setCount(habit.id, ds, done ? 0 : habit.target);
    renderAll();
  } else if (action === "edit") {
    openHabitModal(habit);
  }
});

// ---------- View tabs ----------
el("viewTabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  currentView = btn.dataset.view;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
  ["today", "habits", "insights"].forEach((v) => {
    el(`view-${v}`).hidden = v !== currentView;
  });
});

// ---------- Habit modal ----------
const overlay = el("habitModalOverlay");
const form = el("habitForm");
const dayPicker = el("dayPicker");
let selectedDays = [0, 1, 2, 3, 4, 5, 6];

function openHabitModal(habit) {
  editingHabitId = habit ? habit.id : null;
  el("modalTitle").textContent = habit ? "Edit Habit" : "New Habit";
  el("habitName").value = habit ? habit.name : "";
  el("habitIcon").value = habit ? habit.icon : "✅";
  el("habitColor").value = habit ? habit.color : "#7c5cff";
  el("habitTarget").value = habit ? habit.target : 1;
  selectedDays = habit && habit.days && habit.days.length ? [...habit.days] : [0, 1, 2, 3, 4, 5, 6];
  syncDayPicker();
  el("deleteHabitBtn").hidden = !habit;
  overlay.hidden = false;
  el("habitName").focus();
}
function closeHabitModal() {
  overlay.hidden = true;
  editingHabitId = null;
}
function syncDayPicker() {
  dayPicker.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("selected", selectedDays.includes(Number(b.dataset.day)));
  });
}

dayPicker.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const day = Number(btn.dataset.day);
  if (selectedDays.includes(day)) {
    selectedDays = selectedDays.filter((d) => d !== day);
  } else {
    selectedDays.push(day);
  }
  syncDayPicker();
});

el("addHabitBtn").addEventListener("click", () => openHabitModal(null));
el("emptyAddBtn").addEventListener("click", () => openHabitModal(null));
el("closeModalBtn").addEventListener("click", closeHabitModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeHabitModal();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = el("habitName").value.trim();
  if (!name) return;
  const days = selectedDays.length ? selectedDays : [0, 1, 2, 3, 4, 5, 6];
  const target = Math.max(1, Number(el("habitTarget").value) || 1);
  const icon = el("habitIcon").value.trim() || "✅";
  const color = el("habitColor").value;

  if (editingHabitId) {
    const habit = state.habits.find((h) => h.id === editingHabitId);
    Object.assign(habit, { name, icon, color, target, days });
    toast("Habit updated");
  } else {
    state.habits.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name,
      icon,
      color,
      target,
      days,
      createdAt: todayStr(),
    });
    toast("Habit created");
  }
  saveState();
  closeHabitModal();
  renderAll();
});

// ---------- Delete flow ----------
const confirmOverlay = el("confirmOverlay");
el("deleteHabitBtn").addEventListener("click", () => {
  pendingDeleteId = editingHabitId;
  el("confirmMsg").textContent = "Delete this habit and all of its history? This can't be undone.";
  confirmOverlay.hidden = false;
});
el("confirmCancel").addEventListener("click", () => {
  confirmOverlay.hidden = true;
  pendingDeleteId = null;
});
el("confirmOk").addEventListener("click", () => {
  if (pendingDeleteId) {
    state.habits = state.habits.filter((h) => h.id !== pendingDeleteId);
    delete state.logs[pendingDeleteId];
    saveState();
    toast("Habit deleted");
  }
  confirmOverlay.hidden = true;
  pendingDeleteId = null;
  closeHabitModal();
  renderAll();
});

// ---------- Heatmap habit filter ----------
el("heatmapHabitSelect").addEventListener("change", renderHeatmap);

// ---------- Export / Import ----------
el("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `momentum-habits-${todayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Data exported");
});

el("importBtn").addEventListener("click", () => el("importFile").click());
el("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported.habits || !imported.logs) throw new Error("Invalid file");
      state = imported;
      saveState();
      renderAll();
      toast("Data imported");
    } catch {
      toast("Import failed: invalid file");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

// ---------- Seed demo data on first run ----------
function seedIfEmpty() {
  if (state.habits.length) return;
  state.habits = [
    { id: "seed-1", name: "Drink water", icon: "💧", color: "#22d3ee", target: 8, days: [0, 1, 2, 3, 4, 5, 6], createdAt: todayStr() },
    { id: "seed-2", name: "Read 10 pages", icon: "📖", color: "#7c5cff", target: 1, days: [0, 1, 2, 3, 4, 5, 6], createdAt: todayStr() },
    { id: "seed-3", name: "Workout", icon: "🏋️", color: "#f59e0b", target: 1, days: [1, 2, 3, 4, 5], createdAt: todayStr() },
    { id: "seed-4", name: "School Work", icon: "📚", color: "#f472b6", target: 1, days: [1, 2, 3, 4, 5], createdAt: todayStr() },
  ];
  state.logs = {};
  let cursor = addDays(new Date(), -20);
  const end = new Date();
  while (cursor <= end) {
    const ds = dateStr(cursor);
    if (Math.random() > 0.3) setCount("seed-1", ds, Math.floor(Math.random() * 9));
    if (Math.random() > 0.4) setCount("seed-2", ds, 1);
    if (isScheduled(state.habits[2], cursor) && Math.random() > 0.25) setCount("seed-3", ds, 1);
    if (isScheduled(state.habits[3], cursor) && Math.random() > 0.25) setCount("seed-4", ds, 1);
    cursor = addDays(cursor, 1);
  }
  saveState();
}

// ---------- Init ----------
seedIfEmpty();
renderAll();
