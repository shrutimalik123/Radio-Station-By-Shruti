const themes = {
    'HindiRomantic': 'dnkPe3ocmPU',
    'Chill': '1Waq8ohWbV4',
    '80s': 'VYvCiYJj1VA',
    'Classical': 'p12MGlv4o2s',
    'Workout': 'fCNv0Yxe-ZU',
    'Jazz': '0u34Pb25BNg',
    'Rain': 'jX6kn9_U8qk',
    'Gaming': 'dh01eSOn9_E',
    'House': 'I0NLHgtxfcE',
    'Acoustic': 'eTXjjWdi5Rk'
};

let player;
let activeTheme = null; // No theme active initially

// Load YouTube Iframe API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    // Initialize player with a default video but paused
    player = new YT.Player('radio-player', {
        height: '200',
        width: '200',
        videoId: themes['Chill'], // Default video to load
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'autoplay': 0, // Ensure no autoplay
            'origin': window.location.origin // Helps with some CORS issues
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log("Player Ready");
    player = event.target; // Ensure we have the correct instance
    updateStatus("Player ready. Select a vibe.");
}

function onPlayerStateChange(event) {
    const visualizer = document.querySelector('.visualizer-mock');
    if (event.data == YT.PlayerState.PLAYING) {
        visualizer.style.opacity = '1';
        updateStatus("Playing...");
    } else if (event.data == YT.PlayerState.BUFFERING) {
        updateStatus("Buffering...");
    } else if (event.data == YT.PlayerState.PAUSED) {
        visualizer.style.opacity = '0.5';
        updateStatus("Paused");
    }
}

function onPlayerError(event) {
    console.error("Player Error:", event.data);
    let errorMsg = "Error occurred.";
    if (event.data === 101 || event.data === 150) {
        errorMsg = "Stream not embeddable. Try another.";
    } else if (event.data === 2) {
        errorMsg = "Invalid video ID.";
    }
    updateStatus(errorMsg);
}

function updateStatus(msg) {
    const el = document.getElementById('player-status');
    if (el) el.textContent = msg;
}

function loadStream(themeKey) {
    if (!themes[themeKey]) return;

    activeTheme = themeKey;
    updateActiveButton();
    updateStatus("Loading " + themeKey + "...");

    if (player && typeof player.loadVideoById === 'function') {
        try {
            player.loadVideoById(themes[themeKey]);
            player.unMute();
            player.setVolume(100);
        } catch (e) {
            console.error(e);
            updateStatus("Error calling player: " + e.message);
        }
    } else {
        console.warn("Player object issue", player);
        if (!player) {
            updateStatus("Player not initialized. Refresh page.");
        } else {
            updateStatus("Player API missing. Refresh page.");
        }
    }
}

function renderButtons() {
    const themeGrid = document.getElementById('theme-grid');
    themeGrid.innerHTML = '';

    Object.keys(themes).forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'theme-btn';
        btn.textContent = formatLabel(key);
        btn.onclick = () => loadStream(key);

        if (key === activeTheme) {
            btn.classList.add('active');
        }

        themeGrid.appendChild(btn);
    });
}

function updateActiveButton() {
    const themeGrid = document.getElementById('theme-grid');
    const buttons = themeGrid.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        if (btn.textContent === formatLabel(activeTheme)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function formatLabel(key) {
    return key.replace(/([A-Z])/g, ' $1').trim();
}

// Render buttons immediately so UI is visible
document.addEventListener('DOMContentLoaded', () => {
    renderButtons();
});
