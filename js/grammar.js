// Grammar practice system
export function initGrammar() {
  const grammarQuestion = document.getElementById('grammarQuestion');
  const grammarOptions = document.getElementById('grammarOptions');
  const grammarExplanation = document.getElementById('grammarExplanation');
  const nextGrammarBtn = document.getElementById('nextGrammarBtn');
  
  if (!grammarQuestion) return;
  
  const grammarExercises = [
    {
      question: "Choose the correct form: She ___ to school every day.",
      options: ["go", "goes", "going", "went"],
      answer: 1,
      explanation: "Use 'goes' for third person singular (he, she, it) in present simple tense."
    },
    {
      question: "Which sentence is correct?",
      options: [
        "I am liking pizza.",
        "I like pizza.",
        "I likes pizza.",
        "I is liking pizza."
      ],
      answer: 1,
      explanation: "The verb 'like' is a stative verb and is not usually used in continuous forms."
    },
    {
      question: "Complete the sentence: If it rains, we ___ the picnic.",
      options: ["will cancel", "would cancel", "cancel", "cancelled"],
      answer: 0,
      explanation: "First conditional: if + present simple, will + infinitive."
    },
    {
      question: "Choose the correct preposition: She's afraid ___ spiders.",
      options: ["of", "from", "by", "with"],
      answer: 0,
      explanation: "The correct preposition after 'afraid' is 'of'."
    },
    {
      question: "Which is the correct comparative form?",
      options: ["more big", "bigger", "biggester", "more bigger"],
      answer: 1,
      explanation: "For one-syllable adjectives like 'big', we add -er to form the comparative."
    }
  ];
  
  let currentExercise = 0;
  
  // Load grammar exercise count
  const grammarCount = parseInt(localStorage.getItem('grammarExercises') || 0);
  
  function showExercise() {
    const exercise = grammarExercises[currentExercise];
    grammarQuestion.textContent = exercise.question;
    grammarExplanation.textContent = '';
    
    grammarOptions.innerHTML = '';
    exercise.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'grammar-option';
      button.textContent = option;
      button.addEventListener('click', () => checkAnswer(index, exercise.answer));
      grammarOptions.appendChild(button);
    });
    
    nextGrammarBtn.style.display = 'none';
  }
  
  function checkAnswer(selected, correct) {
    const options = grammarOptions.querySelectorAll('.grammar-option');
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === correct) {
        option.classList.add('correct');
      } else if (index === selected) {
        option.classList.add('incorrect');
      }
    });
    
    grammarExplanation.textContent = grammarExercises[currentExercise].explanation;
    nextGrammarBtn.style.display = 'block';
    
    // Update stats if correct
    if (selected === correct) {
      const totalXP = parseInt(localStorage.getItem('totalXP') || 0);
      localStorage.setItem('totalXP', totalXP + 3);
      
      const grammarExercises = parseInt(localStorage.getItem('grammarExercises') || 0);
      localStorage.setItem('grammarExercises', grammarExercises + 1);
    }
  }
  
  nextGrammarBtn.addEventListener('click', () => {
    currentExercise = (currentExercise + 1) % grammarExercises.length;
    showExercise();
  });
  
  // Initialize first exercise
  showExercise();
}