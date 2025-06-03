<style>
  /* Floating Accessibility Toggle Button */
  #accessibility-toggle-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    background: #007bff;
    color: white;
    border-radius: 50%;
    font-size: 28px;
    border: none;
    z-index: 10001;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #accessibility-widget {
    position: fixed;
    bottom: 90px;
    right: 20px;
    background: linear-gradient(135deg, #ffffff, #f2f2f2);
    border: 2px solid #333;
    padding: 14px;
    border-radius: 12px;
    z-index: 10000;
    width: 240px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: Arial, sans-serif;
    display: none;
  }

  #accessibility-widget h4 {
    margin: 0 0 12px;
    font-size: 18px;
    text-align: center;
    color: #333;
    font-weight: bold;
  }

  .accessibility-button {
    display: block;
    width: 100%;
    margin: 6px 0;
    padding: 9px;
    background: #f9f9f9;
    color: #333;
    border: 1px solid #bbb;
    border-radius: 12px;
    cursor: pointer;
    text-align: center;
    transition: all 0.25s ease;
    font-size: 14px;
  }

  .accessibility-button:hover {
    background: #e6e6e6;
    transform: scale(1.0001);
  }

  .accessibility-button.active {
    background: #007bff;
    color: white;
    font-weight: bold;
    border-color: #0056b3;
  }

  .high-contrast * {
    background-color: black !important;
    color: yellow !important;
    border-color: yellow !important;
  }

  .dyslexia-font * {
    font-family: 'OpenDyslexic', Arial, sans-serif !important;
  }

  #magnifier-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    overflow: hidden;
    z-index: 9999;
    display: none;
    pointer-events: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
    border-bottom: 3px solid #007bff;
  }

  #magnifier-content {
    transform: scale(1.5, 1.5);
    transform-origin: top left;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  body.large-font * {
    font-size: 1.01em !important;
  }
</style>

<!-- Toggle Button -->
<button id="accessibility-toggle-btn" aria-label="Toggle Accessibility Menu">☰</button>

<!-- Accessibility Menu -->
<div id="accessibility-widget">
  <h4>Accessibility</h4>
  <button class="accessibility-button" onclick="toggleFontSize(this)">Font Size</button>
  <button class="accessibility-button" onclick="toggleContrast(this)">High Contrast</button>
  <button class="accessibility-button" onclick="toggleDyslexiaFont(this)">Dyslexia Font</button>
  <button class="accessibility-button" onclick="toggleMagnifier(this)">Magnifier Bar</button>
  <button class="accessibility-button" onclick="toggleSpeech(this)">Text-to-Speech</button>
  <button class="accessibility-button" onclick="resetAccessibility()">Reset</button>
</div>

<!-- Magnifier -->
<div id="magnifier-bar"><div id="magnifier-content"></div></div>

<!-- Load Dyslexia Font -->
<link href="https://fonts.cdnfonts.com/css/open-dyslexic" rel="stylesheet">

<script>
  let isLargeText = false;
  let isHighContrast = false;
  let isDyslexiaFont = false;
  let isMagnifierActive = false;
  let isSpeechActive = false;

  const widget = document.getElementById('accessibility-widget');
  const toggleBtn = document.getElementById('accessibility-toggle-btn');

  toggleBtn.addEventListener('click', () => {
    widget.style.display = widget.style.display === 'block' ? 'none' : 'block';
  });

  function toggleFontSize(btn) {
    isLargeText = !isLargeText;
    document.body.classList.toggle('large-font', isLargeText);
    toggleButtonState(btn);
  }

  function toggleContrast(btn) {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    toggleButtonState(btn);
  }

  function toggleDyslexiaFont(btn) {
    isDyslexiaFont = !isDyslexiaFont;
    document.body.classList.toggle('dyslexia-font', isDyslexiaFont);
    toggleButtonState(btn);
  }

  function toggleMagnifier(btn) {
    isMagnifierActive = !isMagnifierActive;
    const magnifier = document.getElementById('magnifier-bar');
    const content = document.getElementById('magnifier-content');
    toggleButtonState(btn);

    if (isMagnifierActive) {
      magnifier.style.display = 'block';
      content.innerHTML = document.body.innerHTML;
      document.addEventListener('mousemove', moveMagnifier);
    } else {
      magnifier.style.display = 'none';
      content.innerHTML = '';
      document.removeEventListener('mousemove', moveMagnifier);
    }
  }

  function moveMagnifier(e) {
    const magnifier = document.getElementById('magnifier-content');
    magnifier.style.top = -e.pageY + 'px';
    magnifier.style.left = -e.pageX + 'px';
  }

  function toggleSpeech(btn) {
    isSpeechActive = !isSpeechActive;
    toggleButtonState(btn);
    if (isSpeechActive) {
      document.addEventListener('click', speakText);
    } else {
      document.removeEventListener('click', speakText);
      window.speechSynthesis.cancel();
    }
  }

  function speakText(e) {
    const text = e.target.innerText || e.target.alt || '';
    if (text && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }

  function toggleButtonState(btn) {
    btn.classList.toggle('active');
  }

  function resetAccessibility() {
    isLargeText = false;
    isHighContrast = false;
    isDyslexiaFont = false;
    isMagnifierActive = false;
    isSpeechActive = false;

    document.body.classList.remove('large-font', 'high-contrast', 'dyslexia-font');
    document.getElementById('magnifier-bar').style.display = 'none';
    document.getElementById('magnifier-content').innerHTML = '';
    document.removeEventListener('mousemove', moveMagnifier);
    document.removeEventListener('click', speakText);
    window.speechSynthesis.cancel();

    document.querySelectorAll('.accessibility-button').forEach(btn => btn.classList.remove('active'));
  }
</script>