// SMOOTH SCROLL
document.querySelectorAll('a.nav-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// CHANGE NAVBAR ON SCROLL
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


let speech = new SpeechSynthesisUtterance();
let voices = [];
let isSpeaking = false;

const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const voiceSelect = document.getElementById("voice-select");
const fileInput = document.getElementById("file-input");
const toggleBtn = document.getElementById("toggle-btn");

const volumeInput = document.getElementById("volume");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");

// Load voices
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach((voice, i) => {
    const option = new Option(`${voice.name} (${voice.lang})`, i);
    voiceSelect.appendChild(option);
  });
  speech.voice = voices[0];
}
window.speechSynthesis.onvoiceschanged = loadVoices;

// Change voice
voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

// Character counter
textInput.addEventListener("input", () => {
  const len = textInput.value.length;
  charCount.textContent = `${len} / 500`;
});

// Toggle button
toggleBtn.addEventListener("click", () => {
  if (!isSpeaking) {
    let text = textInput.value.trim();
    if (!text) {
      alert("Please type text or upload a file!");
      return;
    }
    speech.text = text;
    speech.volume = parseFloat(volumeInput.value);
    speech.rate = parseFloat(rateInput.value);
    speech.pitch = parseFloat(pitchInput.value);
    window.speechSynthesis.speak(speech);
    toggleBtn.textContent = "Stop";
    isSpeaking = true;

    speech.onend = () => {
      toggleBtn.textContent = "Generate Speech";
      isSpeaking = false;
    };
  } else {
    window.speechSynthesis.cancel();
    toggleBtn.textContent = "Generate Speech";
    isSpeaking = false;
  }
});

// File upload
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = (event) => {
      textInput.value = event.target.result.slice(0, 500);
      charCount.textContent = `${textInput.value.length} / 500`;
    };
    reader.readAsText(file);
  } else {
    alert(`File "${file.name}" uploaded! Only .txt can be read for speech.`);
  }
});

// Smooth FAQ open/close animation
document.querySelectorAll('.accordion-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    if (icon) icon.classList.toggle('rotate');
  });
});



