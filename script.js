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

// Maximum character limit
const MAX_CHARS = 2000;

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

// Character counter and limit
textInput.addEventListener("input", () => {
  let len = textInput.value.length;
  if(len > MAX_CHARS) {
    textInput.value = textInput.value.slice(0, MAX_CHARS);
    len = MAX_CHARS;
    alert("Maximum character limit reached!");
  }
  charCount.textContent = `${len} / ${MAX_CHARS}`;
});

// Toggle button for speaking
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

// File upload (all types accepted)
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    textInput.value = event.target.result.slice(0, MAX_CHARS);
    charCount.textContent = `${textInput.value.length} / ${MAX_CHARS}`;
  };

  // Read different file types as text if possible
  if(file.type.startsWith("text/")) {
    reader.readAsText(file);
  } else if(file.type === "application/pdf") {
    alert("PDF upload detected. Text extraction not supported yet.");
  } else {
    alert(`File "${file.name}" uploaded! Only text files are supported for speech.`);
  }
});

