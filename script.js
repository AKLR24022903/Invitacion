// Configuración de Tailwind CSS
tailwind.config = {
    theme: {
        extend: {
            colors: {
                pikaYellow: '#FFDE00',
                pikaDarkYellow: '#E6C600',
                pikaRed: '#FF0000',
                pikaBlack: '#212121',
                pokeBlue: '#3B4CCA',
                pokeDarkBlue: '#2A3A9E',
            },
            fontFamily: {
                fredoka: ['Fredoka', 'sans-serif'],
                nunito: ['Nunito', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s infinite',
                'bounce-subtle': 'bounceSubtle 2s infinite',
                'electric-glow': 'electricGlow 1.5s infinite alternate',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' }
                },
                electricGlow: {
                    '0%': { boxShadow: '0 0 10px #FFDE00, inset 0 0 5px #FFDE00' },
                    '100%': { boxShadow: '0 0 25px #FFDE00, 0 0 10px #FF0000' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                }
            }
        }
    }
};

// Target Party Date (Default: Dec 6, 2026 14:00:00)
let partyDate = new Date('2026-12-06T14:00:00');

// On Load initialization
window.addEventListener('DOMContentLoaded', () => {
    // Load saved custom link or default
    const savedUrl = localStorage.getItem('mariam_gform_url');
    if (savedUrl) {
        document.getElementById('btnGoogleForms').href = savedUrl;
        document.getElementById('inputGFormUrl').value = savedUrl;
    }

    // Load saved date/time if exists
    const savedDate = localStorage.getItem('mariam_party_date');
    const savedTime = localStorage.getItem('mariam_party_time');
    if (savedDate) {
        document.getElementById('displayDate').textContent = savedDate;
        document.getElementById('inputDate').value = savedDate;
    }
    if (savedTime) {
        document.getElementById('displayTime').textContent = savedTime;
        document.getElementById('inputTime').value = savedTime;
    }

    // Start Countdown Timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initial splash confetti
    setTimeout(() => {
        launchConfetti();
    }, 800);
});

// Toast Notification System
function showToast(msg, icon = '⚡') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;

    toast.classList.remove('opacity-0', '-translate-y-20', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-20', 'pointer-events-none');
    }, 3000);
}

// Toggle Modals
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('hidden');
}

// Save Custom Date/Time
function saveDateTime() {
    const newDate = document.getElementById('inputDate').value.trim();
    const newTime = document.getElementById('inputTime').value.trim();

    if (newDate) {
        document.getElementById('displayDate').textContent = newDate;
        localStorage.setItem('mariam_party_date', newDate);
    }
    if (newTime) {
        document.getElementById('displayTime').textContent = newTime;
        localStorage.setItem('mariam_party_time', newTime);
    }

    toggleModal('modalDate');
    showToast('¡Fecha y horario actualizados!', '📅');
}

// Save Google Form URL
function saveGFormUrl() {
    const url = document.getElementById('inputGFormUrl').value.trim();
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        document.getElementById('btnGoogleForms').href = url;
        localStorage.setItem('mariam_gform_url', url);
        toggleModal('modalGForm');
        showToast('¡Enlace de Google Forms guardado correctamente!', '✅');
    } else {
        showToast('Ingresa una URL válida (ej. https://forms.gle/...)', '⚠️');
    }
}

// Copy Address with fallback
function copyAddress() {
    const textToCopy = document.getElementById('addressText').innerText;
    
    // Temporary textarea method for iframe security support
    const tempInput = document.createElement('textarea');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    showToast('¡Dirección copiada al portapapeles!', '📋');
}

// Countdown Logic
function updateCountdown() {
    const now = new Date().getTime();
    const distance = partyDate.getTime() - now;

    if (distance < 0) {
        document.getElementById('countDays').textContent = "00";
        document.getElementById('countHours').textContent = "00";
        document.getElementById('countMins').textContent = "00";
        document.getElementById('countSecs').textContent = "00";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('countDays').textContent = days < 10 ? '0' + days : days;
    document.getElementById('countHours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('countMins').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('countSecs').textContent = seconds < 10 ? '0' + seconds : seconds;
}

// Confetti Effect
function launchConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFDE00', '#FF0000', '#212121', '#3B4CCA', '#FFFFFF']
        });
    }
}

// Web Audio API Synth for Pikachu Sound
function playPikaSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.3); // D6

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (err) {
        // Audio Context fallback if silent
    }
}