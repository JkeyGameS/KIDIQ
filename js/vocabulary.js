// Vocabulary builder with spaced repetition
export function initVocabulary() {
  const startBtn = document.getElementById('startVocabSession');
  const vocabSession = document.getElementById('vocabSession');
  const vocabWord = document.getElementById('vocabWord');
  const vocabOptions = document.getElementById('vocabOptions');
  const vocabFeedback = document.getElementById('vocabFeedback');
  const vocabProgress = document.getElementById('vocabProgress');
  const vocabProgressText = document.getElementById('vocabProgressText');
  const vocabCategory = document.getElementById('vocabCategory');
  
  if (!startBtn) return;
  
  const vocabulary = [
    // Beginner words
    { word: "apple", translation: "pomme", category: "beginner", level: 1 },
    { word: "book", translation: "livre", category: "beginner", level: 1 },
    { word: "cat", translation: "chat", category: "beginner", level: 1 },
    { word: "dog", translation: "chien", category: "beginner", level: 1 },
    { word: "house", translation: "maison", category: "beginner", level: 1 },
    
    // Intermediate words
    { word: "accomplish", translation: "accomplir", category: "intermediate", level: 2 },
    { word: "brilliant", translation: "brillant", category: "intermediate", level: 2 },
    { word: "diligent", translation: "assidu", category: "intermediate", level: 2 },
    { word: "essential", translation: "essentiel", category: "intermediate", level: 2 },
    { word: "frequent", translation: "fréquent", category: "intermediate", level: 2 },
    
    // Advanced words
    { word: "ambiguous", translation: "ambigu", category: "advanced", level: 3 },
    { word: "benevolent", translation: "bienveillant", category: "advanced", level: 3 },
    { word: "conspicuous", translation: "visible", category: "advanced", level: 3 },
    { word: "enigmatic", translation: "énigmatique", category: "advanced", level: 3 },
    { word: "meticulous", translation: "méticuleux", category: "advanced", level: 3 }
  ];
  
  let currentSession = [];
  let currentQuestion = 0;
  let correctAnswers = 0;
  
  startBtn.addEventListener('click', () => {
    const category = vocabCategory.value;
    currentSession = category === 'all' 
      ? [...vocabulary] 
      : vocabulary.filter(word => word.category === category);
    
    // Shuffle the session
    currentSession = shuffleArray(currentSession).slice(0, 10);
    currentQuestion = 0;
    correctAnswers = 0;
    
    startBtn.style.display = 'none';
    vocabCategory.style.display = 'none';
    vocabSession.style.display = 'block';
    
    updateProgress();
    showNextQuestion();
  });
  
  function showNextQuestion() {
    if (currentQuestion >= currentSession.length) {
      endSession();
      return;
    }
    
    const currentWord = currentSession[currentQuestion];
    vocabWord.textContent = currentWord.word;
    
    // Generate options (1 correct, 3 incorrect)
    const options = [currentWord.translation];
    while (options.length < 4) {
      const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      if (!options.includes(randomWord.translation)) {
        options.push(randomWord.translation);
      }
    }
    
    // Shuffle options
    const shuffledOptions = shuffleArray(options);
    
    // Render options
    vocabOptions.innerHTML = '';
    shuffledOptions.forEach(option => {
      const button = document.createElement('button');
      button.className = 'vocab-option';
      button.textContent = option;
      button.addEventListener('click', () => checkAnswer(option, currentWord.translation));
      vocabOptions.appendChild(button);
    });
    
    vocabFeedback.textContent = '';
  }
  
  function checkAnswer(selected, correct) {
    const options = vocabOptions.querySelectorAll('.vocab-option');
    options.forEach(option => {
      option.disabled = true;
      if (option.textContent === correct) {
        option.classList.add('correct');
      } else if (option.textContent === selected && selected !== correct) {
        option.classList.add('incorrect');
      }
    });
    
    if (selected === correct) {
      vocabFeedback.textContent = '✅ Correct!';
      correctAnswers++;
      
      // Update vocabulary progress in storage
      const vocabLearned = parseInt(localStorage.getItem('vocabularyLearned') || 0);
      localStorage.setItem('vocabularyLearned', vocabLearned + 1);
      
      // Award XP
      const totalXP = parseInt(localStorage.getItem('totalXP') || 0);
      localStorage.setItem('totalXP', totalXP + 2);
    } else {
      vocabFeedback.textContent = `❌ Incorrect. The correct answer is "${correct}".`;
    }
    
    currentQuestion++;
    updateProgress();
    
    setTimeout(showNextQuestion, 1500);
  }
  
  function updateProgress() {
    const progress = (currentQuestion / currentSession.length) * 100;
    vocabProgress.style.width = `${progress}%`;
    vocabProgressText.textContent = `${currentQuestion}/${currentSession.length}`;
  }
  
  function endSession() {
    const accuracy = Math.round((correctAnswers / currentSession.length) * 100);
    vocabSession.innerHTML = `
      <h3>Session Complete!</h3>
      <p>You got ${correctAnswers} out of ${currentSession.length} correct (${accuracy}%)</p>
      <button id="restartVocabSession" class="pill-btn">Practice Again</button>
    `;
    
    document.getElementById('restartVocabSession').addEventListener('click', () => {
      vocabSession.style.display = 'none';
      startBtn.style.display = 'inline-block';
      vocabCategory.style.display = 'inline-block';
    });
    
    // Update stats
    const wordsMastered = parseInt(localStorage.getItem('wordsMastered') || 0);
    localStorage.setItem('wordsMastered', wordsMastered + correctAnswers);
    
    const wordsLearning = parseInt(localStorage.getItem('wordsLearning') || 0);
    localStorage.setItem('wordsLearning', wordsLearning + (currentSession.length - correctAnswers));
    
    updateVocabularyStats();
  }
  
  function updateVocabularyStats() {
    document.getElementById('wordsMastered').textContent = localStorage.getItem('wordsMastered') || 0;
    document.getElementById('wordsLearning').textContent = localStorage.getItem('wordsLearning') || 0;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Initialize stats
  updateVocabularyStats();
}