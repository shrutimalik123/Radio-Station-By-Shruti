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
            'autoplay': 0 // Ensure no autoplay
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log("Player Ready");
    // Player is ready. We don't play anything yet.
}

function onPlayerStateChange(event) {
    const visualizer = document.querySelector('.visualizer-mock');
    if (event.data == YT.PlayerState.PLAYING) {
        visualizer.style.opacity = '1';
    } else {
        visualizer.style.opacity = '0.5';
    }
}

function loadStream(themeKey) {
    if (!themes[themeKey]) return;

    activeTheme = themeKey;
    updateActiveButton();

    if (player && player.loadVideoById) {
        player.loadVideoById(themes[themeKey]);
        // loadVideoById automatically plays the video
    } else {
        console.warn("Player not ready yet");
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
