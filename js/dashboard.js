// Learning dashboard with progress visualization
export function initDashboard() {
  // Initialize charts if Chart.js is available
  if (typeof Chart !== 'undefined') {
    initProgressChart();
    initSkillChart();
  }
  
  // Update statistics
  updateStats();
  
  // Set up periodic updates
  setInterval(updateStats, 60000); // Update every minute
}

function initProgressChart() {
  const ctx = document.getElementById('weeklyProgressChart');
  if (!ctx) return;
  
  // Get progress data from localStorage or use default
  const progressData = JSON.parse(localStorage.getItem('weeklyProgress') || '[]');
  
  // If no data exists, create some sample data
  if (progressData.length === 0) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    for (let i = 0; i < 7; i++) {
      // Generate random progress data, with more recent days having higher values
      const dayIndex = (i + 1) % 7; // Start from Monday
      const value = dayIndex <= today ? Math.floor(Math.random() * 50) + 30 : 0;
      progressData.push({ day: days[dayIndex], value });
    }
    
    localStorage.setItem('weeklyProgress', JSON.stringify(progressData));
  }
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: progressData.map(item => item.day),
      datasets: [{
        label: 'Minutes studied',
        data: progressData.map(item => item.value),
        borderColor: '#19a974',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(25, 169, 116, 0.1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function initSkillChart() {
  const ctx = document.getElementById('skillDistributionChart');
  if (!ctx) return;
  
  // Get skill data from localStorage
  const vocabulary = parseInt(localStorage.getItem('vocabularyLearned') || 0);
  const grammar = parseInt(localStorage.getItem('grammarExercises') || 0);
  const listening = parseInt(localStorage.getItem('listeningExercises') || 0);
  const speaking = parseInt(localStorage.getItem('speakingExercises') || 5); // Default value
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Vocabulary', 'Grammar', 'Listening', 'Speaking'],
      datasets: [{
        data: [vocabulary, grammar, listening, speaking],
        backgroundColor: [
          '#19a974',
          '#ffb41e',
          '#ff6b6b',
          '#339af0'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12
          }
        }
      }
    }
  });
}

function updateStats() {
  // Calculate time spent (simulated - in a real app, you'd track this properly)
  const timeSpent = parseInt(localStorage.getItem('timeSpent') || 0);
  const additionalTime = Math.floor(Math.random() * 5); // Simulate some additional time
  const newTimeSpent = timeSpent + additionalTime;
  localStorage.setItem('timeSpent', newTimeSpent);
  
  const hours = Math.floor(newTimeSpent / 60);
  const minutes = newTimeSpent % 60;
  document.getElementById('timeSpent').textContent = `${hours}h ${minutes}m`;
  
  // Update words learned
  const wordsLearned = parseInt(localStorage.getItem('vocabularyLearned') || 0);
  document.getElementById('wordsLearned').textContent = wordsLearned;
  
  // Calculate accuracy rate (simulated)
  const accuracyRate = Math.min(100, 70 + Math.floor(Math.random() * 30));
  document.getElementById('accuracyRate').textContent = `${accuracyRate}%`;
}