(function() {
  // 1) List every domain (or wildcard) where you allow this widget to run:
  const ALLOWED_DOMAINS = [
    'your-ghl-subdomain.ghl.com',
    'www.yourcustomdomain.com',
    'app.gohighlevel.com',
    // etc…
  ];

  // 2) Grab the current host (e.g. "mysite.com")
  const host = window.location.hostname.toLowerCase();

  // 3) If not in the whitelist, do nothing:
  if (!ALLOWED_DOMAINS.some(d => {
        // if you want to allow subdomains, you can do e.g. d.endsWith(window.location.hostname)
        return host === d.toLowerCase();
      })) 
  {
    console.warn(
      '[AccessibilityWidget] This domain is not authorized to use widget.js: ' + host
    );
    return; // stop execution immediately
  }

  // …the rest of your widget’s code goes HERE (in an IIFE) …
  // (inject CSS, create toggle button, etc.)
  // (exactly like the IIFE from before, but wrapped below this domain check)

  // ──────────────────────────────────────────────────
  // Your existing IIFE code (injected CSS/HTML, event listeners, etc.)
  // ──────────────────────────────────────────────────

(function() {
  // 1️⃣ Wait for DOM to be ready
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function() {
    // 2️⃣ Inject the CSS
    var css = `
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
        font-size: 1.03em !important;
      }
      body.pause-animations * {
  	  animation: none !important;
  	  transition: none !important;
      }

    `;

    var styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);

    // 3️⃣ Inject the Dyslexia font <link>
    var linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://fonts.cdnfonts.com/css/open-dyslexic';
    document.head.appendChild(linkEl);

    // 4️⃣ Create the toggle button
    var toggleBtn = document.createElement('button');
    toggleBtn.id = 'accessibility-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Accessibility Menu');
    toggleBtn.innerHTML = '☰';
    document.body.appendChild(toggleBtn);

    // 5️⃣ Create the accessibility menu container
    var widget = document.createElement('div');
    widget.id = 'accessibility-widget';
    widget.innerHTML =
  '<h4>Accessibility</h4>' +
  '<button class="accessibility-button" data-action="font-size">Font Size</button>' +
  '<button class="accessibility-button" data-action="contrast">High Contrast</button>' +
  '<button class="accessibility-button" data-action="dyslexia-font">Dyslexia Font</button>' +
  '<button class="accessibility-button" data-action="magnifier">Magnifier Bar</button>' +
  '<button class="accessibility-button" data-action="speech">Text-to-Speech</button>' +
  '<button class="accessibility-button" data-action="pause-animations">Pause Animations</button>' +
  '<button class="accessibility-button" data-action="reset">Reset</button>';

    document.body.appendChild(widget);

    // 6️⃣ Create magnifier wrapper elements
    var magnifierBar = document.createElement('div');
    magnifierBar.id = 'magnifier-bar';
    var magnifierContent = document.createElement('div');
    magnifierContent.id = 'magnifier-content';
    magnifierBar.appendChild(magnifierContent);
    document.body.appendChild(magnifierBar);

    // 7️⃣ State variables
    var isLargeText = false;
    var isHighContrast = false;
    var isDyslexiaFont = false;
    var isMagnifierActive = false;
    var isSpeechActive = false;
    var isAnimationsPaused = false;


    // 8️⃣ Toggle widget visibility
    toggleBtn.addEventListener('click', function() {
      widget.style.display = widget.style.display === 'block' ? 'none' : 'block';
    });

    // 9️⃣ Helper to toggle CSS class on <body> and mark button active/inactive
    function toggleBodyClass(className, state) {
      document.body.classList.toggle(className, state);
    }

    function setButtonActive(btn, state) {
      if (state) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }

    // 🔟 “Font Size” toggle
    function toggleFontSize(btn) {
      isLargeText = !isLargeText;
      toggleBodyClass('large-font', isLargeText);
      setButtonActive(btn, isLargeText);
    }

    // 1️⃣1️⃣ “High Contrast” toggle
    function toggleContrast(btn) {
  isHighContrast = !isHighContrast;
  document.body.classList.toggle('high-contrast', isHighContrast);
  setButtonActive(btn, isHighContrast);

  if (isHighContrast) {
    document.querySelectorAll('*').forEach(el => {
      // stash old styles if you want to restore on reset
      el._oldColor   = el.style.getPropertyValue('color');
      el._oldBg      = el.style.getPropertyValue('background-color');
      el._oldBorder  = el.style.getPropertyValue('border-color');

      // force the new ones inline (cannot be beaten)
      el.style.setProperty('color',           'yellow',   'important');
      el.style.setProperty('background-color','black',    'important');
      el.style.setProperty('border-color',    'yellow',   'important');
    });
  } else {
    // restore previous inline values (or remove them)
    document.querySelectorAll('*').forEach(el => {
      if (el._oldColor)  el.style.setProperty('color',            el._oldColor);
      else               el.style.removeProperty('color');

      if (el._oldBg)     el.style.setProperty('background-color', el._oldBg);
      else               el.style.removeProperty('background-color');

      if (el._oldBorder) el.style.setProperty('border-color',     el._oldBorder);
      else               el.style.removeProperty('border-color');
    });
  }
}


    // 1️⃣2️⃣ “Dyslexia Font” toggle
    function toggleDyslexiaFont(btn) {
      isDyslexiaFont = !isDyslexiaFont;
      toggleBodyClass('dyslexia-font', isDyslexiaFont);
      setButtonActive(btn, isDyslexiaFont);
    }
    
    // 1️⃣4️⃣ “Pause Animations” toggle
     function togglePauseAnimations(btn) {
        isAnimationsPaused = !isAnimationsPaused;
        toggleBodyClass('pause-animations', isAnimationsPaused);
        setButtonActive(btn, isAnimationsPaused);
      }


    // 1️⃣3️⃣ “Magnifier” toggle
    function toggleMagnifier(btn) {
      isMagnifierActive = !isMagnifierActive;
      setButtonActive(btn, isMagnifierActive);

      if (isMagnifierActive) {
        magnifierBar.style.display = 'block';
        magnifierContent.innerHTML = document.body.innerHTML;
        document.addEventListener('mousemove', moveMagnifier);
      } else {
        magnifierBar.style.display = 'none';
        magnifierContent.innerHTML = '';
        document.removeEventListener('mousemove', moveMagnifier);
      }
    }

    function moveMagnifier(e) {
      magnifierContent.style.top = -e.pageY + 'px';
      magnifierContent.style.left = -e.pageX + 'px';
    }

    // 1️⃣4️⃣ “Text-to-Speech” toggle
    function toggleSpeech(btn) {
      isSpeechActive = !isSpeechActive;
      setButtonActive(btn, isSpeechActive);

      if (isSpeechActive) {
        document.addEventListener('click', speakText);
      } else {
        document.removeEventListener('click', speakText);
        window.speechSynthesis.cancel();
      }
    }

    function speakText(e) {
      var text = e.target.innerText || e.target.alt || '';
      if (text && window.speechSynthesis) {
        var utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }

   function resetAccessibility() {
  // Reset all states
  isLargeText = false;
  isHighContrast = false;
  isDyslexiaFont = false;
  isMagnifierActive = false;
  isSpeechActive = false;
  isAnimationsPaused = false;

  // Remove all added classes from body
  document.body.classList.remove('large-font', 'high-contrast', 'dyslexia-font', 'pause-animations');

  // Deactivate all buttons
  document.querySelectorAll('.accessibility-button.active').forEach(btn => {
    btn.classList.remove('active');
  });

  // Hide magnifier if visible
  magnifierBar.style.display = 'none';
  magnifierContent.innerHTML = '';
  document.removeEventListener('mousemove', moveMagnifier);

  // Restore previously overridden styles
  document.querySelectorAll('*').forEach(el => {
    if (el._oldColor) el.style.setProperty('color', el._oldColor);
    else el.style.removeProperty('color');

    if (el._oldBg) el.style.setProperty('background-color', el._oldBg);
    else el.style.removeProperty('background-color');

    if (el._oldBorder) el.style.setProperty('border-color', el._oldBorder);
    else el.style.removeProperty('border-color');
  });
}


    // 1️⃣6️⃣ Delegate clicks on each button to its handler
// 1️⃣6️⃣ Delegate clicks on each button to its handler
	widget.addEventListener('click', function(event) {
  // Only handle clicks on buttons with the specific class
  if (!event.target.classList.contains('accessibility-button')) return;

  // Get the action from the clicked button
  var action = event.target.getAttribute('data-action');

  switch (action) {
    case 'font-size':
      toggleFontSize(event.target);
      break;
    case 'contrast':
      toggleContrast(event.target);
      break;
    case 'dyslexia-font':
      toggleDyslexiaFont(event.target);
      break;
    case 'magnifier':
      toggleMagnifier(event.target);
      break;
    case 'speech':
      toggleSpeech(event.target);
      break;
    case 'pause-animations':
      togglePauseAnimations(event.target);
      break;
    case 'reset':
      resetAccessibility();
      break;
  	}
	});
  });
})();


})(); // end IIFE