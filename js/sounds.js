// Sound effects for correct/incorrect answers
function createSound(frequency, duration, type) {
  try {
    const audioCtx = new (window.AudioContext || window.webAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + (duration/1000));
    
    setTimeout(() => {
      oscillator.stop();
    }, duration);
  } catch (e) {
    console.log('Web Audio API not supported:', e);
  }
}

// Play correct answer sound
function playCorrectSound() {
  createSound(523.25, 300, 'sine'); // C5
  createSound(659.25, 300, 'sine'); // E5
  createSound(783.99, 500, 'sine'); // G5
}

// Play wrong answer sound
function playWrongSound() {
  createSound(392.00, 200, 'sine'); // G4
  createSound(349.23, 400, 'sine'); // F4
}

// Replace the playSound function in main.js with this:
function playSound(kind) {
  if (kind === 'correct') {
    playCorrectSound();
  } else if (kind === 'wrong') {
    playWrongSound();
  }
}