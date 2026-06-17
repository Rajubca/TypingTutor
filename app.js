// --- DATA SOURCES ---
const wordsList = [
    "the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "not", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father"
];

const sentencesList = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "The five boxing wizards jump quickly.",
    "A wizard's job is to vex chumps quickly in fog.",
    "Watch \"Jeopardy!\", Alex Trebek's fun TV quiz game.",
    "By Jove, my quick study of lexicography won a prize!",
    "Woven silk pyjamas exchanged for blue quartz.",
    "Brawny gods just flocked up to quiz and vex him.",
    "Adjusting quivers and bows, the experts aim.",
    "My girl wove six dozen plaid jackets before she quit.",
    "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
    "The public was amazed to view the quickness and dexterity of the juggler."
];

const codeList = [
    "function calculateSum(a, b) {\n  return a + b;\n}",
    "const items = [1, 2, 3];\nitems.forEach(item => console.log(item));",
    "if (x > 10) {\n  status = 'high';\n} else {\n  status = 'low';\n}",
    "for (let i = 0; i < array.length; i++) {\n  sum += array[i];\n}",
    "class User {\n  constructor(name) {\n    this.name = name;\n  }\n}",
    "const filterEven = nums.filter(n => n % 2 === 0);",
    "import React, { useState } from 'react';",
    "const element = document.getElementById('main');\nelement.innerHTML = 'Hello';\n",
    "try {\n  const data = JSON.parse(jsonString);\n} catch (e) {\n  console.error(e);\n}"
];

// --- APP STATE ---
let config = {
    mode: 'words',
    duration: 60,
    showHands: true
};

let state = {
    text: "",
    currentIndex: 0,
    startTime: null,
    timerInterval: null,
    timeLeft: 0,
    isActive: false,
    stats: {
        correctChars: 0,
        incorrectChars: 0,
        totalTypedChars: 0
    }
};

// --- DOM ELEMENTS ---
const elements = {
    textDisplay: document.getElementById('text-display'),
    time: document.getElementById('time'),
    wpm: document.getElementById('wpm'),
    accuracy: document.getElementById('accuracy'),
    restartBtn: document.getElementById('restart-btn'),
    keyboard: document.getElementById('keyboard'),
    handsContainer: document.getElementById('hands-container'),
    visualAids: document.getElementById('visual-aids'),

    // Modal
    resultsModal: document.getElementById('results-modal'),
    finalWpm: document.getElementById('final-wpm'),
    finalAccuracy: document.getElementById('final-accuracy'),
    finalChars: document.getElementById('final-chars'),
    modalRestart: document.getElementById('modal-restart')
};

// --- KEYBOARD LAYOUT & FINGER MAPPING ---
// Map keys to specific fingers for highlighting
const fingerMapping = {
    // Left Pinky
    '1': 'l-pinky', 'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky', '`': 'l-pinky', 'ShiftLeft': 'l-pinky',
    // Left Ring
    '2': 'l-ring', 'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
    // Left Middle
    '3': 'l-middle', 'e': 'l-middle', 'd': 'l-middle', 'c': 'l-middle',
    // Left Index
    '4': 'l-index', '5': 'l-index', 'r': 'l-index', 't': 'l-index', 'f': 'l-index', 'g': 'l-index', 'v': 'l-index', 'b': 'l-index',
    // Thumbs
    ' ': 'thumb', 'Space': 'thumb',
    // Right Index
    '6': 'r-index', '7': 'r-index', 'y': 'r-index', 'u': 'r-index', 'h': 'r-index', 'j': 'r-index', 'n': 'r-index', 'm': 'r-index',
    // Right Middle
    '8': 'r-middle', 'i': 'r-middle', 'k': 'r-middle', ',': 'r-middle', '<': 'r-middle',
    // Right Ring
    '9': 'r-ring', 'o': 'r-ring', 'l': 'r-ring', '.': 'r-ring', '>': 'r-ring',
    // Right Pinky
    '0': 'r-pinky', '-': 'r-pinky', '=': 'r-pinky', 'p': 'r-pinky', '[': 'r-pinky', ']': 'r-pinky', '\\': 'r-pinky',
    ';': 'r-pinky', "'": 'r-pinky', 'Enter': 'r-pinky', '/': 'r-pinky', '?': 'r-pinky', 'ShiftRight': 'r-pinky'
};

const keyboardLayout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Space']
];

// --- INITIALIZATION ---
function init() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('mode')) config.mode = urlParams.get('mode');
    if (urlParams.has('duration')) config.duration = parseInt(urlParams.get('duration'), 10);
    if (urlParams.has('hands')) config.showHands = urlParams.get('hands') === 'true';

    // Setup UI
    if (!config.showHands) {
        elements.visualAids.style.display = 'none';
    } else {
        renderKeyboard();
        renderHands();
    }

    setupEventListeners();
    startNewPractice();
}

// --- CONTENT GENERATION ---
function generateText() {
    let content = [];
    if (config.mode === 'words') {
        for (let i = 0; i < 100; i++) {
            content.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
        }
        return content.join(" ");
    } else if (config.mode === 'sentences') {
        for (let i = 0; i < 15; i++) {
            content.push(sentencesList[Math.floor(Math.random() * sentencesList.length)]);
        }
        return content.join(" ");
    } else if (config.mode === 'code') {
        for (let i = 0; i < 5; i++) {
            content.push(codeList[Math.floor(Math.random() * codeList.length)]);
        }
        return content.join("\n\n");
    }
}

function renderText() {
    elements.textDisplay.textContent = '';
    state.text.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        charSpan.classList.add('char');
        charSpan.id = `char-${index}`;
        if (index === 0) charSpan.classList.add('current');
        elements.textDisplay.appendChild(charSpan);
    });
}

function startNewPractice() {
    state.text = generateText();
    state.currentIndex = 0;
    state.startTime = null;
    state.timeLeft = config.duration;
    state.isActive = false;
    state.stats = { correctChars: 0, incorrectChars: 0, totalTypedChars: 0 };

    clearInterval(state.timerInterval);
    updateStatsUI();
    renderText();
    elements.time.innerText = formatTime(state.timeLeft);
    elements.resultsModal.classList.add('hidden');
    elements.textDisplay.focus();

    if (config.showHands) {
        highlightTargetKey(state.text[0]);
    }
}

// --- TYPING ENGINE ---
function handleKeyDown(e) {
    if (elements.resultsModal.classList.contains('hidden') === false) return;

    // Ignore meta keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock' || e.key === 'Tab') {
        if (config.showHands) highlightActiveKey(e.code);
        return;
    }

    // Start timer on first valid keystroke
    if (!state.isActive) {
        state.isActive = true;
        state.startTime = Date.now();
        state.timerInterval = setInterval(updateTimer, 1000);
    }

    e.preventDefault(); // Prevent scrolling on space, etc

    if (config.showHands) highlightActiveKey(e.key === ' ' ? 'Space' : e.key);

    if (e.key === 'Backspace') {
        handleBackspace();
    } else {
        handleKeyPress(e.key);
    }
}

function handleKeyUp(e) {
    if (config.showHands) {
        removeActiveKeyHighlight(e.key === ' ' ? 'Space' : e.key, e.code);
    }
}

function handleKeyPress(keyTyped) {
    if (state.currentIndex >= state.text.length) {
        // Generate more text if we reach the end
        const newText = generateText();
        state.text += (config.mode === 'words' ? " " : "\n\n") + newText;
        // Re-render text display efficiently (just append new spans)
        const startIndex = state.currentIndex;
        state.text.substring(startIndex).split('').forEach((char, i) => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            charSpan.classList.add('char');
            charSpan.id = `char-${startIndex + i}`;
            elements.textDisplay.appendChild(charSpan);
        });
    }

    const expectedChar = state.text[state.currentIndex];

    // Handle Enter mapping to newline in code mode
    const isEnterForNewline = expectedChar === '\n' && keyTyped === 'Enter';
    const isMatch = keyTyped === expectedChar || isEnterForNewline;

    const charElement = document.getElementById(`char-${state.currentIndex}`);

    state.stats.totalTypedChars++;

    if (isMatch) {
        charElement.classList.add('correct');
        charElement.classList.remove('current', 'incorrect');
        state.stats.correctChars++;
    } else {
        charElement.classList.add('incorrect');
        charElement.classList.remove('current');
        state.stats.incorrectChars++;
    }

    state.currentIndex++;

    // Update next char
    const nextCharElement = document.getElementById(`char-${state.currentIndex}`);
    if (nextCharElement) {
        nextCharElement.classList.add('current');
        // Scroll into view if needed
        const displayRect = elements.textDisplay.getBoundingClientRect();
        const charRect = nextCharElement.getBoundingClientRect();
        if (charRect.bottom > displayRect.bottom || charRect.top < displayRect.top) {
            nextCharElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateStatsUI();
    if (config.showHands) {
        const nextExpected = state.text[state.currentIndex];
        highlightTargetKey(nextExpected === '\n' ? 'Enter' : nextExpected);
    }
}

function handleBackspace() {
    if (state.currentIndex > 0) {
        // Remove current cursor
        const currentElement = document.getElementById(`char-${state.currentIndex}`);
        if (currentElement) {
            currentElement.classList.remove('current');
        }

        state.currentIndex--;

        const prevElement = document.getElementById(`char-${state.currentIndex}`);

        // Remove stats for that char
        if (prevElement.classList.contains('correct')) state.stats.correctChars--;
        if (prevElement.classList.contains('incorrect')) state.stats.incorrectChars--;

        prevElement.className = 'char current';

        if (config.showHands) {
            const expected = state.text[state.currentIndex];
            highlightTargetKey(expected === '\n' ? 'Enter' : expected);
        }
        updateStatsUI();
    }
}

// --- TIMERS AND STATS ---
function updateTimer() {
    if (state.timeLeft > 0) {
        state.timeLeft--;
        elements.time.innerText = formatTime(state.timeLeft);
        updateStatsUI(); // Update WPM as time passes
    } else {
        endPractice();
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function calculateWPM() {
    const timeElapsedInMinutes = (config.duration - state.timeLeft) / 60;
    if (timeElapsedInMinutes === 0) return 0;

    // Standard WPM formula: (correct chars / 5) / minutes
    const wpm = Math.round((state.stats.correctChars / 5) / timeElapsedInMinutes);
    return wpm < 0 ? 0 : wpm;
}

function calculateAccuracy() {
    if (state.currentIndex === 0) return 100;
    return Math.round((state.stats.correctChars / state.currentIndex) * 100);
}

function updateStatsUI() {
    elements.wpm.innerText = calculateWPM();
    elements.accuracy.innerText = calculateAccuracy();
}

function endPractice() {
    clearInterval(state.timerInterval);
    state.isActive = false;

    const finalWpm = calculateWPM();
    const finalAcc = calculateAccuracy();

    elements.finalWpm.innerText = finalWpm;
    elements.finalAccuracy.innerText = finalAcc;
    elements.finalChars.innerText = `${state.stats.correctChars} / ${state.stats.incorrectChars} / 0 / 0`;

    elements.resultsModal.classList.remove('hidden');

    saveResultToLocalStorage({
        date: new Date().toISOString(),
        mode: config.mode,
        duration: config.duration,
        wpm: finalWpm,
        accuracy: finalAcc
    });
}

function saveResultToLocalStorage(result) {
    let history = JSON.parse(localStorage.getItem('typingTutorHistory')) || [];
    history.unshift(result);
    localStorage.setItem('typingTutorHistory', JSON.stringify(history));
}

// --- VISUAL AIDS (KEYBOARD & HANDS) ---
function renderKeyboard() {
    elements.keyboard.textContent = '';

    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';

        row.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';

            // Assign display label and ID
            let displayLabel = key;
            let keyId = key.toLowerCase();

            if (key === 'Space') {
                displayLabel = '';
                keyDiv.classList.add('key-space');
                keyId = 'space';
            } else if (key === 'Backspace' || key === 'Enter' || key === 'CapsLock' || key === 'Shift') {
                keyDiv.classList.add('key-wider');
                keyId = key.toLowerCase();
            } else if (key === 'Tab' || key === '\\') {
                keyDiv.classList.add('key-wide');
                keyId = key.toLowerCase();
            }

            keyDiv.innerText = displayLabel;
            keyDiv.id = `key-${keyId}`;
            rowDiv.appendChild(keyDiv);
        });

        elements.keyboard.appendChild(rowDiv);
    });
}

function renderHands() {
    // Generate SVG for two hands
    const svgContent = `
    <svg viewBox="0 0 400 150" class="hand-svg">
        <!-- LEFT HAND -->
        <g id="hand-left" transform="translate(50, 20)">
            <!-- Palm -->
            <path d="M 30,80 Q 50,130 90,80 L 100,60 L 20,60 Z" fill="#444" />
            <!-- Fingers -->
            <rect id="finger-l-pinky" class="finger" x="15" y="30" width="12" height="40" rx="6" />
            <rect id="finger-l-ring" class="finger" x="35" y="15" width="14" height="55" rx="7" />
            <rect id="finger-l-middle" class="finger" x="55" y="5" width="14" height="65" rx="7" />
            <rect id="finger-l-index" class="finger" x="75" y="20" width="14" height="50" rx="7" />
            <!-- Thumb -->
            <path id="finger-thumb-l" class="finger" d="M 95,60 Q 120,70 120,90 Q 120,100 110,100 Q 90,90 90,80 Z" />
        </g>

        <!-- RIGHT HAND -->
        <g id="hand-right" transform="translate(200, 20)">
            <!-- Palm -->
            <path d="M 120,80 Q 100,130 60,80 L 50,60 L 130,60 Z" fill="#444" />
            <!-- Fingers -->
            <rect id="finger-r-index" class="finger" x="60" y="20" width="14" height="50" rx="7" />
            <rect id="finger-r-middle" class="finger" x="80" y="5" width="14" height="65" rx="7" />
            <rect id="finger-r-ring" class="finger" x="100" y="15" width="14" height="55" rx="7" />
            <rect id="finger-r-pinky" class="finger" x="120" y="30" width="12" height="40" rx="6" />
            <!-- Thumb -->
            <path id="finger-thumb-r" class="finger" d="M 55,60 Q 30,70 30,90 Q 30,100 40,100 Q 60,90 60,80 Z" />
        </g>
    </svg>
    `;
    elements.handsContainer.innerHTML = svgContent;
}

function highlightTargetKey(char) {
    if (!char || !config.showHands) return;

    // Clear previous targets
    document.querySelectorAll('.key.target').forEach(el => el.classList.remove('target'));
    document.querySelectorAll('.finger.target').forEach(el => el.classList.remove('target'));

    let searchKey = char.toLowerCase();
    if (char === ' ') searchKey = 'space';
    else if (char === '\n') searchKey = 'enter';

    // Handle shift requirement for uppercase or special chars visually
    const requiresShift = /^[A-Z~!@#$%^&*()_+{}|:"<>?]$/.test(char);
    if (requiresShift) {
        const leftShift = document.getElementById('key-shift'); // Just grabs the first one for visual cue
        if (leftShift) leftShift.classList.add('target');
    }

    const keyEl = document.getElementById(`key-${searchKey}`);
    if (keyEl) {
        keyEl.classList.add('target');
    }

    // Highlight finger
    let mappedFinger = fingerMapping[searchKey];
    // Special handling for thumb
    if (mappedFinger === 'thumb') {
        mappedFinger = 'thumb-r'; // Default to right thumb for space
    }

    if (mappedFinger) {
        const fingerEl = document.getElementById(`finger-${mappedFinger}`);
        if (fingerEl) fingerEl.classList.add('target');
    }
}

function highlightActiveKey(keyStr) {
    if (!keyStr) return;
    let searchKey = keyStr.toLowerCase();
    if (searchKey === ' ') searchKey = 'space';

    const keyEl = document.getElementById(`key-${searchKey}`);
    if (keyEl) keyEl.classList.add('active');

    let mappedFinger = fingerMapping[searchKey];
    if (mappedFinger === 'thumb') mappedFinger = 'thumb-r';

    if (mappedFinger) {
        const fingerEl = document.getElementById(`finger-${mappedFinger}`);
        if (fingerEl) fingerEl.classList.add('active');
    }
}

function removeActiveKeyHighlight(keyStr, codeStr) {
    if (!keyStr) return;
    let searchKey = keyStr.toLowerCase();
    if (searchKey === ' ') searchKey = 'space';

    const keyEl = document.getElementById(`key-${searchKey}`);
    if (keyEl) keyEl.classList.remove('active');

    let mappedFinger = fingerMapping[searchKey];
    if (mappedFinger === 'thumb') mappedFinger = 'thumb-r';

    if (mappedFinger) {
        const fingerEl = document.getElementById(`finger-${mappedFinger}`);
        if (fingerEl) fingerEl.classList.remove('active');
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    elements.restartBtn.addEventListener('click', startNewPractice);
    elements.modalRestart.addEventListener('click', startNewPractice);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Keep focus on typing area
    document.addEventListener('click', () => {
        if (elements.resultsModal.classList.contains('hidden')) {
            elements.textDisplay.focus();
        }
    });
}

// --- START ---
window.onload = init;
