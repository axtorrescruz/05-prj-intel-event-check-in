// Grab existing DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greetingEl = document.getElementById("greeting");
const checkInBtn = document.getElementById("checkInBtn");

// === NEW: team counters in memory ===
let teamScores = {
  water: 0,
  zero: 0,
  power: 0
};

// Track attendance totals
let count = 0;
const maxCount = 50;

// Create attendee list container dynamically
// so we don’t have to touch index.html
const teamStats = document.querySelector(".team-stats");
const attendeeList = document.createElement("ul");
attendeeList.id = "attendeeList";
attendeeList.style.listStyle = "none";
attendeeList.style.marginTop = "20px";
attendeeList.style.padding = "0";
teamStats.appendChild(attendeeList);

// Helper: increment text inside an element
function incrementTextCounter(el) {
  if (!el) return 0;
  const current = parseInt(el.textContent, 10) || 0;
  const next = current + 1;
  el.textContent = next;
  return next;
}

// Helper: update progress bar width
function updateProgressBar(current, max) {
  const pct = Math.round((current / max) * 100);
  progressBar.style.width = pct + "%";
  progressBar.setAttribute("aria-valuenow", String(current));
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", String(max));
}

// Helper: show temporary greeting or celebration
function showGreeting(message, isCelebration = false) {
  greetingEl.textContent = message;
  greetingEl.classList.add("success-message");
  greetingEl.style.display = "block";
  // For celebration, keep it up longer
  const time = isCelebration ? 8000 : 3500;
  setTimeout(() => {
    greetingEl.style.display = "none";
  }, time);
}

// Helper: find the winning team’s name
function getWinningTeam() {
  const entries = Object.entries(teamScores); // [["water", n], ...]
  // Sort descending by score
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  const teamMap = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables"
  };
  return teamMap[top[0]];
}

// When attendance is full, disable button and celebrate
function handleMaxReached() {
  checkInBtn.disabled = true;
  checkInBtn.textContent = "Full";
  const winner = getWinningTeam();
  const message = `🎉 Attendance goal reached! Congratulations to ${winner} for the strongest turnout!`;
  showGreeting(message, true);
}

// Helper: add an attendee to the list below team counters
function addAttendeeToList(name, teamKey) {
  const li = document.createElement("li");
  const teamMap = {
    water: "Team Water Wise",
    zero: "Team Net Zero",
    power: "Team Renewables"
  };
  li.textContent = `${name} — ${teamMap[teamKey]}`;
  li.style.padding = "4px 0";
  attendeeList.appendChild(li);
}

// === Main Form Submit ===
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) return;

  // Increment total count
  count++;
  attendeeCountEl.textContent = count;

  // Update progress bar
  updateProgressBar(count, maxCount);

  // Update team counters (DOM + memory)
  const teamCounter = document.getElementById(team + "Count");
  incrementTextCounter(teamCounter);
  teamScores[team]++;

  // Show personal greeting
  showGreeting(`🎉 Welcome, ${name} from ${teamName}!`);

  // Add attendee to live list
  addAttendeeToList(name, team);

  // Check for celebration
  if (count >= maxCount) {
    handleMaxReached();
  }

  // Reset for next entry
  form.reset();
  nameInput.focus();
});
