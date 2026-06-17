// --- STATS LOGIC ---
const elements = {
    avgWpm: document.getElementById('avg-wpm'),
    highestWpm: document.getElementById('highest-wpm'),
    avgAcc: document.getElementById('avg-acc'),
    totalTests: document.getElementById('total-tests'),
    historyBody: document.getElementById('history-body'),
    clearBtn: document.getElementById('clear-stats-btn')
};

function initStats() {
    const history = JSON.parse(localStorage.getItem('typingTutorHistory')) || [];

    if (history.length === 0) {
        elements.historyBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No practice history yet. Go type something!</td></tr>';
        return;
    }

    // Calculate aggregations
    let totalWpm = 0;
    let totalAcc = 0;
    let maxWpm = 0;

    history.forEach(session => {
        totalWpm += session.wpm;
        totalAcc += session.accuracy;
        if (session.wpm > maxWpm) maxWpm = session.wpm;
    });

    const avgWpm = Math.round(totalWpm / history.length);
    const avgAcc = Math.round(totalAcc / history.length);

    // Update UI Summary
    elements.avgWpm.innerText = avgWpm;
    elements.highestWpm.innerText = maxWpm;
    elements.avgAcc.innerText = `${avgAcc}%`;
    elements.totalTests.innerText = history.length;

    // Populate Table
    elements.historyBody.innerHTML = '';

    // Only show last 20 tests in history table to prevent it getting too long
    const displayHistory = history.slice(0, 20);

    displayHistory.forEach(session => {
        const date = new Date(session.date).toLocaleString();
        const durationMins = session.duration / 60;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td style="text-transform: capitalize;">${session.mode}</td>
            <td>${durationMins} Min</td>
            <td><strong>${session.wpm}</strong></td>
            <td>${session.accuracy}%</td>
        `;
        elements.historyBody.appendChild(tr);
    });
}

// Setup Event Listeners
if (elements.clearBtn) {
    elements.clearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all your typing statistics? This cannot be undone.")) {
            localStorage.removeItem('typingTutorHistory');

            // Reset UI
            elements.avgWpm.innerText = '0';
            elements.highestWpm.innerText = '0';
            elements.avgAcc.innerText = '0%';
            elements.totalTests.innerText = '0';
            elements.historyBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No practice history yet. Go type something!</td></tr>';
        }
    });
}

// Initialize on load
window.onload = initStats;
