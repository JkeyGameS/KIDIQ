// Listening comprehension system
export function initListening() {
  const playAudioBtn = document.getElementById('playAudioBtn');
  const listeningQuestion = document.getElementById('listeningQuestion');
  const listeningOptions = document.getElementById('listeningOptions');
  const listeningTranscript = document.getElementById('listeningTranscript');
  const listeningFeedback = document.getElementById('listeningFeedback');
  
  if (!playAudioBtn) return;
  
  const listeningExercises = [
    {
      audioText: "I usually have breakfast at seven o'clock in the morning.",
      question: "What time does the speaker have breakfast?",
      options: ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"],
      answer: 1,
      transcript: "I usually have breakfast at seven o'clock in the morning."
    },
    {
      audioText: "She went to the market to buy some vegetables and fruits.",
      question: "Where did she go and why?",
      options: [
        "To the park for a walk",
        "To the market to buy food",
        "To the cinema to watch a movie",
        "To the library to study"
      ],
      answer: 1,
      transcript: "She went to the market to buy some vegetables and fruits."
    },
    {
      audioText: "The meeting has been postponed until next Wednesday.",
      question: "What happened to the meeting?",
      options: [
        "It was canceled",
        "It was successful",
        "It was postponed",
        "It was shortened"
      ],
      answer: 2,
      transcript: "The meeting has been postponed until next Wednesday."
    }
  ];
  
  let currentExercise = 0;
  
  playAudioBtn.addEventListener('click', () => {
    const exercise = listeningExercises[currentExercise];
    
    // Use speech synthesis to "play" the audio
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(exercise.audioText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    
    // Show the question and options
    listeningQuestion.textContent = exercise.question;
    listeningTranscript.textContent = '';
    
    listeningOptions.innerHTML = '';
    exercise.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'listening-option';
      button.textContent = option;
      button.addEventListener('click', () => checkAnswer(index, exercise.answer, exercise));
      listeningOptions.appendChild(button);
    });
    
    listeningFeedback.textContent = '';
    playAudioBtn.textContent = 'Play Again';
  });
  
  function checkAnswer(selected, correct, exercise) {
    const options = listeningOptions.querySelectorAll('.listening-option');
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === correct) {
        option.classList.add('correct');
      } else if (index === selected) {
        option.classList.add('incorrect');
      }
    });
    
    listeningTranscript.textContent = exercise.transcript;
    
    if (selected === correct) {
      listeningFeedback.textContent = '✅ Correct!';
      
      // Update stats and award XP
      const totalXP = parseInt(localStorage.getItem('totalXP') || 0);
      localStorage.setItem('totalXP', totalXP + 4);
      
      const listeningExercises = parseInt(localStorage.getItem('listeningExercises') || 0);
      localStorage.setItem('listeningExercises', listeningExercises + 1);
      
      // Move to next exercise after a delay
      setTimeout(() => {
        currentExercise = (currentExercise + 1) % listeningExercises.length;
        resetExercise();
      }, 2500);
    } else {
      listeningFeedback.textContent = '❌ Try again. Listen carefully.';
    }
  }
  
  function resetExercise() {
    listeningQuestion.textContent = '';
    listeningOptions.innerHTML = '';
    listeningTranscript.textContent = '';
    listeningFeedback.textContent = '';
    playAudioBtn.textContent = 'Play Audio';
  }
}