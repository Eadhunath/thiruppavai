// Thiruppavai Application Logic

let currentVerseIndex = 0;
let currentLanguage = localStorage.getItem('selectedLanguage') || 'english';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeVerseSelector();
  initializeLanguageSelector();
  setDefaultVerse();
  displayVerse(currentVerseIndex);
  setupEventListeners();
});

// Calculate which verse to display by default
function setDefaultVerse() {
  const today = new Date();
  const margazhiDay = getMargazhiDay(today);

  if (margazhiDay !== null) {
    // We're in Margazhi month, show the corresponding verse
    currentVerseIndex = margazhiDay - 1; // Array is 0-indexed
    updateDateInfo(`Margazhi Day ${margazhiDay} - ${formatDate(today)}`);
  } else {
    // Outside Margazhi, default to verse 1
    currentVerseIndex = 0;
    updateDateInfo(`Outside Margazhi period - ${formatDate(today)}`);
  }
}

// Calculate if today is in Margazhi and which day
function getMargazhiDay(date) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0 = January, 11 = December)
  const day = date.getDate();

  // Margazhi typically runs from December 16 to January 14
  // December 16 = Day 1, January 14 = Day 30

  if (month === 11 && day >= 16) {
    // December 16-31
    return day - 15; // Dec 16 = day 1, Dec 17 = day 2, etc.
  } else if (month === 0 && day <= 14) {
    // January 1-14
    return 16 + day; // Jan 1 = day 17, Jan 2 = day 18, ..., Jan 14 = day 30
  }

  return null; // Not in Margazhi period
}

// Format date for display
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Update the date info display
function updateDateInfo(text) {
  document.getElementById('dateInfo').textContent = text;
}

// Initialize verse selector dropdown
function initializeVerseSelector() {
  const select = document.getElementById('verseSelect');
  verses.forEach((verse, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = verse.number;
    select.appendChild(option);
  });
}

// Initialize language selector
function initializeLanguageSelector() {
  const select = document.getElementById('languageSelect');
  select.value = currentLanguage;
  updateLanguageDisplay();
}

// Update which language section is displayed
function updateLanguageDisplay() {
  // Hide all language sections
  document.querySelectorAll('.language-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show the selected language section
  const activeSection = document.querySelector(`[data-language="${currentLanguage}"]`);
  if (activeSection) {
    activeSection.classList.add('active');
  }
}

// Handle language change
function handleLanguageChange(event) {
  currentLanguage = event.target.value;
  localStorage.setItem('selectedLanguage', currentLanguage);
  updateLanguageDisplay();
}

// Display the selected verse
function displayVerse(index) {
  if (index < 0 || index >= verses.length) {
    console.error('Invalid verse index');
    return;
  }

  const verse = verses[index];

  // Update verse content
  document.getElementById('tamilVerse').innerHTML = formatVerseText(verse.tamil);
  document.getElementById('sanskritVerse').innerHTML = formatVerseText(verse.sanskrit);
  document.getElementById('englishVerse').innerHTML = formatVerseText(verse.english);

  // Update verse selector dropdown
  document.getElementById('verseSelect').value = index;

  // Update navigation button states
  updateNavigationButtons();

  // Handle media section
  updateMediaSection(verse);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Format verse text (preserve line breaks)
function formatVerseText(text) {
  if (!text) return '<p class="placeholder">Content coming soon...</p>';
  return text.split('\n').map(line => {
    if (line.trim() === '') return '<br>';
    return `<p>${line}</p>`;
  }).join('');
}

// Update media section if audio/video exists
function updateMediaSection(verse) {
  const mediaSection = document.getElementById('mediaSection');
  const audioContainer = document.getElementById('audioContainer');
  const videoContainer = document.getElementById('videoContainer');

  audioContainer.innerHTML = '';
  videoContainer.innerHTML = '';

  let hasMedia = false;

  if (verse.audio) {
    hasMedia = true;
    audioContainer.innerHTML = `
      <div class="media-item">
        <h4>Audio Recitation</h4>
        <audio controls>
          <source src="${verse.audio}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
  }

  if (verse.video) {
    hasMedia = true;
    videoContainer.innerHTML = `
      <div class="media-item">
        <h4>Video Recitation</h4>
        <iframe width="560" height="315" src="${verse.video}"
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
      </div>
    `;
  }

  mediaSection.style.display = hasMedia ? 'block' : 'none';
}

// Update navigation button states
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  prevBtn.disabled = currentVerseIndex === 0;
  nextBtn.disabled = currentVerseIndex === verses.length - 1;
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('prevBtn').addEventListener('click', goToPreviousVerse);
  document.getElementById('nextBtn').addEventListener('click', goToNextVerse);
  document.getElementById('todayBtn').addEventListener('click', goToTodayVerse);
  document.getElementById('verseSelect').addEventListener('change', handleVerseSelect);
  document.getElementById('languageSelect').addEventListener('change', handleLanguageChange);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      goToPreviousVerse();
    } else if (e.key === 'ArrowRight') {
      goToNextVerse();
    }
  });
}

// Navigation functions
function goToPreviousVerse() {
  if (currentVerseIndex > 0) {
    currentVerseIndex--;
    displayVerse(currentVerseIndex);
  }
}

function goToNextVerse() {
  if (currentVerseIndex < verses.length - 1) {
    currentVerseIndex++;
    displayVerse(currentVerseIndex);
  }
}

function goToTodayVerse() {
  const today = new Date();
  const margazhiDay = getMargazhiDay(today);

  if (margazhiDay !== null) {
    // We're in Margazhi, go to today's verse
    currentVerseIndex = margazhiDay - 1;
  } else {
    // Outside Margazhi, go to verse 1
    currentVerseIndex = 0;
  }

  displayVerse(currentVerseIndex);
}

function handleVerseSelect(event) {
  currentVerseIndex = parseInt(event.target.value);
  displayVerse(currentVerseIndex);
}
