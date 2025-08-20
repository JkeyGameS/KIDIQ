// Achievements system
export function initAchievements() {
  const achievementsGrid = document.getElementById('achievementsGrid');
  if (!achievementsGrid) return;
  
  const achievements = [
    {
      id: 'first_lesson',
      name: 'First Lesson',
      description: 'Complete your first lesson',
      icon: '📚',
      condition: (userData) => userData.lessonsCompleted >= 1,
      xpReward: 10
    },
    {
      id: 'streak_3',
      name: '3-Day Streak',
      description: 'Maintain a 3-day learning streak',
      icon: '🔥',
      condition: (userData) => userData.streak >= 3,
      xpReward: 15
    },
    {
      id: 'vocab_10',
      name: 'Word Master',
      description: 'Learn 10 vocabulary words',
      icon: '🔤',
      condition: (userData) => userData.vocabularyLearned >= 10,
      xpReward: 20
    },
    {
      id: 'grammar_expert',
      name: 'Grammar Expert',
      description: 'Complete 5 grammar exercises',
      icon: '📝',
      condition: (userData) => userData.grammarExercises >= 5,
      xpReward: 25
    },
    {
      id: 'listening_pro',
      name: 'Listening Pro',
      description: 'Complete 3 listening exercises',
      icon: '👂',
      condition: (userData) => userData.listeningExercises >= 3,
      xpReward: 20
    },
    {
      id: 'xp_100',
      name: 'Centurion',
      description: 'Earn 100 XP points',
      icon: '💯',
      condition: (userData) => userData.totalXP >= 100,
      xpReward: 30
    }
  ];

  // Load user data
  const userData = {
    lessonsCompleted: parseInt(localStorage.getItem('lessonsCompleted') || 0),
    streak: parseInt(localStorage.getItem('studyStreak') || 0),
    vocabularyLearned: parseInt(localStorage.getItem('vocabularyLearned') || 0),
    grammarExercises: parseInt(localStorage.getItem('grammarExercises') || 0),
    listeningExercises: parseInt(localStorage.getItem('listeningExercises') || 0),
    totalXP: parseInt(localStorage.getItem('totalXP') || 0)
  };

  // Load earned achievements
  const earnedAchievements = JSON.parse(localStorage.getItem('earnedAchievements') || '[]');
  
  // Render achievements
  achievements.forEach(achievement => {
    const isEarned = earnedAchievements.includes(achievement.id);
    const progress = calculateProgress(achievement, userData);
    
    const achievementEl = document.createElement('div');
    achievementEl.className = `achievement ${isEarned ? 'earned' : ''}`;
    achievementEl.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-desc">${achievement.description}</div>
      <div class="achievement-progress">
        <div class="achievement-progress-bar" style="width: ${isEarned ? 100 : progress}%"></div>
      </div>
    `;
    
    achievementsGrid.appendChild(achievementEl);
  });

  // Check for new achievements
  checkForNewAchievements(achievements, userData, earnedAchievements);
}

function calculateProgress(achievement, userData) {
  // For binary achievements (completed/not completed)
  if (achievement.condition(userData)) return 100;
  
  // For progressive achievements
  if (achievement.id === 'vocab_10') {
    return Math.min(100, (userData.vocabularyLearned / 10) * 100);
  }
  if (achievement.id === 'grammar_expert') {
    return Math.min(100, (userData.grammarExercises / 5) * 100);
  }
  if (achievement.id === 'listening_pro') {
    return Math.min(100, (userData.listeningExercises / 3) * 100);
  }
  if (achievement.id === 'xp_100') {
    return Math.min(100, (userData.totalXP / 100) * 100);
  }
  
  return 0;
}

function checkForNewAchievements(achievements, userData, earnedAchievements) {
  let newAchievements = [];
  
  achievements.forEach(achievement => {
    if (!earnedAchievements.includes(achievement.id) && achievement.condition(userData)) {
      earnedAchievements.push(achievement.id);
      newAchievements.push(achievement);
      
      // Award XP for new achievement
      const totalXP = parseInt(localStorage.getItem('totalXP') || 0);
      localStorage.setItem('totalXP', totalXP + achievement.xpReward);
    }
  });
  
  if (newAchievements.length > 0) {
    localStorage.setItem('earnedAchievements', JSON.stringify(earnedAchievements));
    showAchievementNotification(newAchievements);
  }
}

function showAchievementNotification(achievements) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <h3>🎉 Achievement Unlocked!</h3>
    ${achievements.map(a => `
      <div class="achievement-notification-item">
        <span class="achievement-icon">${a.icon}</span>
        <div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.description}</div>
        </div>
      </div>
    `).join('')}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 5000);
}