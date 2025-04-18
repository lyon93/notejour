export class SoundEffectsManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    
    // Load all sound effects
    this.loadSounds([
      'press_key1', 'press_key2', 'press_key3', 'press_key4', 'press_key5',
      'press_space', 'press_enter', 'press_back',
      'release_key', 'release_space', 'release_enter', 'release_back'
    ]);
  }

  loadSounds(soundNames) {
    soundNames.forEach(name => {
      this.sounds[name] = new Audio(`/sound-effects/${name}.mp3`);
      // Preload sounds
      this.sounds[name].load();
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playKeyPress() {
    if (!this.enabled) return;
    
    // Randomly select one of the 5 key press sounds
    const randomNum = Math.floor(Math.random() * 5) + 1;
    this.playSound(`press_key${randomNum}`);
  }

  playKeyRelease() {
    if (!this.enabled) return;
    this.playSound('release_key');
  }

  playSpacePress() {
    if (!this.enabled) return;
    this.playSound('press_space');
  }

  playSpaceRelease() {
    if (!this.enabled) return;
    this.playSound('release_space');
  }

  playEnterPress() {
    if (!this.enabled) return;
    this.playSound('press_enter');
  }

  playEnterRelease() {
    if (!this.enabled) return;
    this.playSound('release_enter');
  }

  playBackspacePress() {
    if (!this.enabled) return;
    this.playSound('press_back');
  }

  playBackspaceRelease() {
    if (!this.enabled) return;
    this.playSound('release_back');
  }

  playSound(soundName) {
    if (this.sounds[soundName]) {
      // Clone the audio to allow for overlapping sounds
      const sound = this.sounds[soundName].cloneNode();
      sound.volume = 0.3; // Adjust volume as needed
      sound.play().catch(e => console.error('Failed to play sound:', e));
    }
  }
}