// Main application module
import { initAchievements } from './achievements.js';
import { initVocabulary } from './vocabulary.js';
import { initGrammar } from './grammar.js';
import { initListening } from './listening.js';
import { initDashboard } from './dashboard.js';

// Theme management
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const sun = document.getElementById("bgSun");
const moon = document.getElementById("bgMoon");
const bgStars = document.querySelectorAll(".star");

let theme = localStorage.getItem("theme") || "light";
setTheme(theme);
themeToggle.onclick = () => {
  theme = (theme === "light") ? "dark" : "light";
  setTheme(theme);
};

function setTheme(mode) {
  if (mode === "dark") {
    body.classList.add("dark");
    body.classList.remove("light");
    themeToggle.textContent = "🌞";
    sun.style.display = "none";
    moon.style.display = "block";
    bgStars.forEach(s => s.style.display = "block");
  } else {
    body.classList.add("light");
    body.classList.remove("dark");
    themeToggle.textContent = "🌛";
    sun.style.display = "block";
    moon.style.display = "none";
    bgStars.forEach(s => s.style.display = "none");
  }
  localStorage.setItem("theme", mode);
}

// Profile management
const avatarDisplay = document.getElementById('avatarDisplay');
const profileName   = document.getElementById('profileName');
const editProfileBtn= document.getElementById('editProfileBtn');
const profileStreak = document.getElementById('profileStreak');
const profileXP     = document.getElementById('profileXP');

function loadProfile() {
  profileName.textContent = localStorage.getItem('profileName') || "Guest";
  avatarDisplay.textContent = localStorage.getItem('avatar') || "🐱";
  profileStreak.textContent = `🔥 Current Streak: ${localStorage.getItem('studyStreak') || 0} day(s)`;
  profileXP.textContent = `⭐ Total XP: ${parseInt(localStorage.getItem('totalXP')||0}`;
}

function saveProfile(name, avatar) {
  localStorage.setItem('profileName', name);
  localStorage.setItem('avatar', avatar);
  loadProfile();
  updateLeaderboard();
}

loadProfile();

editProfileBtn.onclick = () => {
  let nameInput = prompt("ENTER YOUR NAME:", profileName.textContent);
  let avatarInput = prompt("Choose an emoji for your avatar (e.g. 🐱 🌟 🍀):", avatarDisplay.textContent);
  let name = (nameInput === null) ? profileName.textContent : nameInput.trim() || "Guest";
  let avatar = (avatarInput === null) ? avatarDisplay.textContent : (avatarInput.trim() || "🐱");
  saveProfile(name, avatar);
};

// Streak management
const streakKey = "studyStreak", lastVisitKey = "lastVisit";
let streak = parseInt(localStorage.getItem(streakKey)) || 0;
const lastVisit = localStorage.getItem(lastVisitKey);
const todayStr = new Date().toDateString();
if (lastVisit !== todayStr) {
  const wasYesterday = lastVisit && (new Date(lastVisit).getTime() + 86400000 === new Date(todayStr).getTime());
  streak = wasYesterday ? streak + 1 : 1;
  localStorage.setItem(streakKey, streak);
  localStorage.setItem(lastVisitKey, todayStr);
}
document.getElementById("streakBox").textContent = `🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}`;
profileStreak.textContent = `🔥 Current Streak: ${streak} day(s)`;

// Badge system
function updateBadges() {
  let xp = parseInt(localStorage.getItem('totalXP')) || 0;
  let st = parseInt(localStorage.getItem('studyStreak')) || 0;
  const badges = [];
  if (xp >= 20) badges.push("⭐ Beginner");
  if (xp >= 100) badges.push("🌟 Advanced");
  if (st >= 3) badges.push("🔥 3-Day Streak");
  if (st >= 7) badges.push("🏆 1-Week Master");
  document.getElementById("badgeList").textContent = badges.length ? badges.join(" ") : "None";
}
updateBadges();

// XP System
function awardXP(points, {reason=''} = {}) {
  const before = parseInt(localStorage.getItem('totalXP') || 0);
  const after  = before + points;
  localStorage.setItem('totalXP', after);

  // UI updates
  profileXP.textContent = `⭐ Total XP: ${after}`;
  updateXPBarFromTotal();
  updateBadges();
  updateLeaderboard();

  // little pop on XP text
  profileXP.classList.add('xpPop');
  setTimeout(()=> profileXP.classList.remove('xpPop'), 450);

  if(points > 0) showXPNotification(`+${points} XP! ${reason}`.trim());
  return after;
}

function updateXPBarFromTotal() {
  const totalXP = parseInt(localStorage.getItem('totalXP')) || 0;
  const pct = Math.min(100, (totalXP % 100));
  document.getElementById("xpBar").style.width = pct + '%';
  profileXP.textContent = `⭐ Total XP: ${totalXP}`;
}

function showXPNotification(message) {
  showConfetti();
  const notif = document.createElement('div');
  notif.textContent = message;
  Object.assign(notif.style, {
    position: 'fixed', bottom: '120px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--primary)', color:'#fff', padding:'0.5rem 1rem', borderRadius:'24px',
    fontWeight:'600', zIndex: 9999, opacity: 1, transition:'all 2s ease-out', textAlign:'center'
  });
  const wrap = document.createElement('div'); 
  wrap.style.position='relative'; 
  wrap.appendChild(notif);
  document.body.appendChild(wrap);
  addSparkle(notif);
  setTimeout(() => { notif.style.bottom = '180px'; notif.style.opacity = 0; }, 50);
  setTimeout(() => { if(document.body.contains(wrap)) document.body.removeChild(wrap); }, 2050);
}

function showConfetti() {
  try { confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } }); } catch(e){}
}

function addSparkle(notif) {
  const sparkleCount = 10;
  for (let i = 0; i < sparkleCount; i++) {
    const s = document.createElement('div');
    s.style.position = 'absolute';
    s.style.width = s.style.height = (Math.random() * 6 + 4) + 'px';
    s.style.background = '#fff';
    s.style.borderRadius = '50%';
    s.style.left = Math.random() * notif.offsetWidth + 'px';
    s.style.top  = Math.random() * notif.offsetHeight + 'px';
    s.style.opacity = Math.random();
    s.style.pointerEvents = 'none';
    s.style.transform = `scale(${Math.random()})`;
    s.style.filter = 'blur(1px)';
    notif.appendChild(s);
    s.animate(
      [{ transform: 'translateY(0) scale(0.5)', opacity: 1 },
       { transform: `translateY(-${Math.random()*20 + 10}px) scale(1)`, opacity: 0 }],
      { duration: 800 + Math.random()*400, iterations: 1 }
    );
    setTimeout(() => { if (notif.contains(s)) notif.removeChild(s); }, 1200);
  }
}

function playSound(kind){
  const ok = document.getElementById('sndCorrect');
  const no = document.getElementById('sndWrong');
  try {
    if(kind==='correct') { ok && ok.currentTime!==undefined && (ok.currentTime=0, ok.play()); }
    if(kind==='wrong')   { no && no.currentTime!==undefined && (no.currentTime=0, no.play()); }
  } catch(e){}
}

// Leaderboard
function updateLeaderboard() {
  const list = document.getElementById('leaderboardList');
  let board = JSON.parse(localStorage.getItem('leaderboard') || '[]');

  const name   = localStorage.getItem('profileName') || 'Guest';
  const avatar = localStorage.getItem('avatar') || '🐱';
  const streak = parseInt(localStorage.getItem('studyStreak') || '0');
  const xp     = parseInt(localStorage.getItem('totalXP') || '0');

  const existing = board.find(u => u.name === name);
  if (existing) {
    existing.xp = xp;
    existing.streak = streak;
    existing.avatar = avatar;
  } else {
    board.push({ name, xp, streak, avatar });
  }

  board.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('leaderboard', JSON.stringify(board));

  list.innerHTML = '';
  board.slice(0, 10).forEach((u, i) => {
    const li = document.createElement('li');
    let medal = i===0 ? '🥇 ' : i===1 ? '🥈 ' : i===2 ? '🥉 ' : '';
    li.innerHTML = `<span>${i+1}. ${medal}${u.avatar} ${u.name}</span><span>${u.xp} XP (🔥${u.streak})</span>`;
    list.appendChild(li);
  });
}
updateLeaderboard();

// Daily Reward
function giveDailyReward() {
  const today = new Date().toDateString();
  const lastLoginReward = localStorage.getItem('lastLoginReward');
  if (lastLoginReward !== today) {
    awardXP(20, {reason: 'Daily Reward 🎁'});
    localStorage.setItem('lastLoginReward', today);
  }
}
giveDailyReward();

// Initialize modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initAchievements();
  initVocabulary();
  initGrammar();
  initListening();
  initDashboard();
  updateXPBarFromTotal();
});