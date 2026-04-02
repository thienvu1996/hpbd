// CONFIGURATION & ASSETS
const imageFolder = 'image/';
const imageFiles = [
    "1J22AQ5BN_43UH5J.jpg", "IMG_0108.JPG", "IMG_0154.JPG", "IMG_2459.JPG",
    "IMG_2716.PNG", "IMG_2755.JPG", "IMG_2898.JPG", "IMG_2902.JPG",
    "IMG_3246.JPG", "IMG_4698.JPG", "IMG_5443.JPEG", "IMG_5445.JPEG",
    "IMG_5448.JPG", "IMG_5984.JPG", "IMG_5985.JPG", "beauty_1739427935835.JPEG"
];

const photoWishes = [
    "Chúc em bé luôn rạng rỡ như ánh bình minh! ☀️",
    "Mong mọi giấc mơ của em đều trở thành hiện thực. ✨",
    "Tuổi mới thật nhiều sức khỏe và bình an nhé em. 🍵",
    "Của em nè, cả thế giới của anh đó! 💖",
    "Hãy luôn tự tin và tỏa sáng theo cách riêng của mình! 🌟",
    "Dù có chuyện gì xảy ra, anh vẫn luôn ở đây bên em. 🤝",
    "Chúc em gặt hái được nhiều thành công trong sự nghiệp. 🏆",
    "Mong em luôn giữ được nét hồn nhiên và đáng yêu này. 🦄",
    "Yêu em nhiều hơn cả những gì ngôn từ có thể diễn tả. ❤️",
    "Chúc em có một sinh nhật thật ấm áp bên người thân. 🏡",
    "Mỗi ngày bên em đều là một món quà vô giá với anh. 🎁",
    "Hành trình phía trước sẽ luôn có anh nắm tay thật chặt. 👫",
    "Em là điều tuyệt vời nhất từng đến với anh! 💑",
    "Chúc em tuổi 26 thật ngọt ngào và tràn đầy tiếng cười! 🍰",
    "Mãi mãi là nàng công chúa bé nhỏ của anh nhé! 👸",
    "Cùng anh viết tiếp những trang nhật ký hạnh phúc nha! 📖",
    "Sinh nhật vui vẻ, hạnh phúc và luôn xinh đẹp nhé em! 🌹"
];

const carouselWishes = [
    "Chúc mừng sinh nhật Thùy! 🎂", "Mãi là em bé đáng yêu của anh nhé! ✨",
    "Chúc tuổi 26 rực rỡ và hạnh phúc! 🌟", "Yêu em nhiều hơn mỗi ngày! ❤️", "Cùng anh đi thật xa nhé! 😊"
];

const birthdayPass = '0204';
const questions = [
    { q: "Năm nay Thùy bước sang tuổi bao nhiêu?", a: ["26 tuổi", "25 tuổi", "24 tuổi", "27 tuổi"], correct: 0 },
    { q: "Duy nhất một cái tên này mang lại hạnh phúc cho anh?", a: ["Bảo Thùy", "Ánh Tuyết", "Minh Thư", "Hồng Ngọc"], correct: 0 },
    { q: "Món quà nào khiến em bé hạnh phúc nhất?", a: ["Vàng bạc", "Kim cương", "Hàng hiệu", "Sự chân thành của anh"], correct: 3 },
    { q: "Thùy sinh năm bao nhiêu?", a: ["1999", "2001", "2000", "2002"], correct: 2 },
    { q: "Hôm nay là ngày đặc biệt của ai?", a: ["Em bé của anh", "Một người bạn", "Tất cả mọi người", "Không ai cả"], correct: 0 }
];

// STATE MANAGEMENT
let player;
let isMusicPlaying = false;
let currentStep = 0;
let activeCard = null;
let canClickCards = false;

// YOUTUBE API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0', width: '0',
        videoId: 'Wu8NeFXaoOc',
        playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': 'Wu8NeFXaoOc' },
        events: { 'onReady': () => console.log("Music ready") }
    });
}

function toggleMusic() {
    if (!player) return;
    const btn = document.querySelector('.audio-control');
    if (isMusicPlaying) {
        player.pauseVideo();
        btn.classList.remove('playing');
    } else {
        player.playVideo();
        btn.classList.add('playing');
    }
    isMusicPlaying = !isMusicPlaying;
}

// NAVIGATION
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenId}`).classList.add('active');
}

// LOGIN
function checkLogin() {
    const input = document.getElementById('login-pass');
    if (input.value === birthdayPass) {
        showScreen('quiz');
        loadQuestion();
    } else {
        document.getElementById('login-error').style.display = 'block';
        input.value = '';
    }
}

// QUIZ
function loadQuestion() {
    const qData = questions[currentStep];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('quiz-step').innerText = `${currentStep + 1}/${questions.length}`;
    document.getElementById('progress-fill').style.width = `${(currentStep / questions.length) * 100}%`;

    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
        btn.classList.remove('correct', 'wrong');
        btn.querySelector('.text').innerText = qData.a[i];
    });
}

function handleAnswer(idx) {
    const correct = questions[currentStep].correct;
    const btns = document.querySelectorAll('.option-btn');
    if (idx === correct) {
        btns[idx].classList.add('correct');
        setTimeout(() => {
            currentStep++;
            if (currentStep < questions.length) loadQuestion();
            else finishQuiz();
        }, 800);
    } else {
        btns[idx].classList.add('wrong');
        setTimeout(() => btns[idx].classList.remove('wrong'), 500);
    }
}

function finishQuiz() {
    document.getElementById('progress-fill').style.width = '100%';
    setTimeout(() => {
        showScreen('wheel');
        initWheel();
    }, 800);
}

// WHEEL OF FORTUNE LOGIC
const prizes = [
    { label: "Son môi",      img: "image/prize_lipstick_1775105425805.png" },
    { label: "Một nụ hôn",   img: "image/prize_kiss_1775105438245.png" },
    { label: "Đi ăn lẩu",   img: "image/prize_hotpot_1775105453088.png" },
    { label: "Gấu bông",     img: "image/prize_teddy_1775105466000.png" },
    { label: "Kẹo mút",      img: "image/prize_lollipop_1775105479365.png" },
    { label: "Cái nịt",      img: "image/prize_belt_1775105496445.png" },
    { label: "Đi xem phim",  img: "image/prize_movie_1775105509942.png" },
    { label: "Trà sữa",      img: "image/prize_bubbletea_1775105526957.png" },
    { label: "Du lịch",      img: "image/prize_travel_1775105539642.png" },
    { label: "Lời khen",     img: "image/prize_flower_1775105551999.png" }
];
const wheelColors = ["#ff758c","#ff9eb5","#fbc3bc","#ffb3c6","#ff6b81","#ff4d79","#ff758c","#ff9eb5","#fbc3bc","#ffb3c6"];

function initWheel() {
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');

    // Match canvas resolution to its CSS display size (for desktop scaling)
    const rect = canvas.getBoundingClientRect();
    const size = rect.width || canvas.width;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;
    const slice = (Math.PI * 2) / prizes.length;
    const imgSize = size * 0.12; // proportional image size

    ctx.clearRect(0, 0, size, size);

    // Draw segments first
    prizes.forEach((p, i) => {
        const angle = i * slice;
        ctx.beginPath();
        ctx.fillStyle = wheelColors[i];
        ctx.moveTo(center, center);
        ctx.arc(center, center, center - 3, angle, angle + slice);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Draw images + labels on segments
    prizes.forEach((p, i) => {
        const angle = i * slice + slice / 2;
        const imgR = center * 0.65; // distance from center
        const imgX = center + Math.cos(angle) * imgR;
        const imgY = center + Math.sin(angle) * imgR;

        const image = new Image();
        image.src = p.img;
        image.onload = () => {
            ctx.save();
            ctx.translate(imgX, imgY);
            ctx.rotate(angle + Math.PI / 2);
            // Clip to a small circle
            ctx.beginPath();
            ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(image, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
            ctx.restore();

            // Draw label
            ctx.save();
            ctx.translate(imgX, imgY);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText(p.label, 0, imgSize / 2 + 12);
            ctx.restore();
        };
    });

    // Center circle decoration
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = '#ff758c';
    ctx.font = 'bold 14px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('✨', center, center + 5);
}

function spinWheel() {
    const wheel = document.querySelector('.wheel-container');
    const btn = document.getElementById('spin-btn');
    if (btn.classList.contains('disabled')) return;

    btn.classList.add('disabled');
    
    // 100% win Son môi (prizes[0]). Slice = 36deg.
    // Index 0 is at 0-36deg in canvas. Pointer 👇 is at 270deg (top).
    // To land index 0 under pointer, we rotate by 270 - 18 = 252deg.
    const extraSpins = 5 * 360; // 5 full rotations
    const targetAngle = 252; // To put index 0 at the top
    const totalRotation = extraSpins + targetAngle;

    wheel.style.transform = `rotate(${totalRotation}deg)`;

    // Show result after 6s (sync with CSS transition)
    setTimeout(() => {
        document.getElementById('wheel-result').style.display = 'block';
        document.getElementById('spin-btn').style.display = 'none';
        document.getElementById('prize-name').textContent = prizes[0].label + ' 💄';
        document.getElementById('prize-img').src = prizes[0].img;
        confettiExplosion();
    }, 6000);
}

function goToBirthday() {
    showScreen('birthday');
    startCelebration();
}

// CELEBRATION
function startCelebration() {
    createPetals();
    createPhotoCards();
    startWishes();
    initParticleSystem();
    initPrankListener(); // RE-ADD PRANK
    setTimeout(() => { canClickCards = true; }, 1500);
}

function initPrankListener() {
    const screen = document.getElementById('screen-birthday');
    // Listen for clicks on the main birthday container
    screen.addEventListener('mousedown', (e) => {
        // Trigger prank IF we clicked the screen or the grid layer themselves (not a card)
        if (e.target.id === 'screen-birthday' || e.target.id === 'photo-cards-grid') {
            showPrank(e.clientX, e.clientY);
        }
    });
}

function showPrank(x, y) {
    const msg = document.createElement('div');
    msg.className = 'prank-msg';
    msg.innerText = 'Lêu lêu gà bấm hụt 🤪';
    msg.style.left = `${x}px`;
    msg.style.top = `${y}px`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1500);
}

function createPetals() {
    const container = document.getElementById('petal-container');
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = Math.random() * 15 + 10 + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = Math.random() * 5 + 5 + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}

function createPhotoCards() {
    const grid = document.getElementById('photo-cards-grid');
    grid.innerHTML = '';
    const isMobile = window.innerWidth <= 768;

    imageFiles.forEach((file, i) => {
        const card = document.createElement('div');
        card.className = 'flip-card';

        if (!isMobile) {
            // DESKTOP FLYING MODE
            card.style.top = (Math.random() * 80 + 5) + '%';
            card.style.left = (Math.random() * 80 + 5) + '%';
            card.style.animation = `float-${(i % 4) + 1} ${Math.random() * 5 + 10}s infinite ease-in-out`;
            card.style.animationDelay = (Math.random() * -10) + 's';
            card.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
        }

        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="card-front"><img src="${imageFolder}${file}" alt="Memory"></div>
                <div class="card-back"><p>${photoWishes[i] || 'Mãi yêu em!'}</p></div>
            </div>
        `;
        card.onclick = () => handleCardClick(card);
        grid.appendChild(card);
    });
}

function handleCardClick(card) {
    if (!canClickCards || activeCard) return;
    activeCard = card;

    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    // Bring the entire grid layer to the front
    document.getElementById('photo-cards-grid').style.zIndex = '2100';

    // Stage 1: Animation fly to center and start flip
    card.classList.add('flying', 'flipped');

    // Stage 2: Swap content at the 90-degree "invisible" point (approx 400ms)
    // This ensures child text is never seen from its original back (mirrored)
    setTimeout(() => {
        if (card.classList.contains('flipped')) {
            front.style.visibility = 'hidden';
            back.style.opacity = '1';
            back.style.transform = 'rotateY(180deg)'; // This aligns with the parent 180 turn
        }
    }, 400);

    document.getElementById('overlay-bg').classList.add('active');
}

function closeFlyingCard() {
    if (!activeCard) return;

    const card = activeCard;
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    card.classList.remove('flipped');

    // Reverse swap at 90-degree point during close
    setTimeout(() => {
        if (!card.classList.contains('flipped')) {
            front.style.visibility = 'visible';
            back.style.opacity = '0';
        }
    }, 400);

    setTimeout(() => {
        card.classList.remove('flying');
        document.getElementById('overlay-bg').classList.remove('active');
        document.getElementById('photo-cards-grid').style.zIndex = '50'; // Reset back to background
        activeCard = null;
    }, 800);
}

function startWishes() {
    let idx = 0;
    const el = document.getElementById('wishes-carousel');
    setInterval(() => {
        el.style.opacity = 0;
        setTimeout(() => {
            idx = (idx + 1) % carouselWishes.length;
            el.innerText = carouselWishes[idx];
            el.style.opacity = 1;
        }, 500);
    }, 4000);
}

function blowOutCandles() {
    const flame = document.getElementById('flame');
    if (flame.style.display === 'none') return;
    flame.style.display = 'none';
    confettiExplosion();
    document.querySelector('.sweet-msg').innerText = "Điều ước của em chắc chắn sẽ thành hiện thực! ✨🎂";
}

function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.5;
            this.opacity = Math.random();
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    for (let i = 0; i < 50; i++) particles.push(new Particle());
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function confettiExplosion() {
    for (let i = 0; i < 50; i++) {
        const s = document.createElement('div');
        s.style.position = 'fixed';
        s.style.left = '50%'; s.style.top = '50%';
        s.style.width = '8px'; s.style.height = '8px';
        s.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        s.style.zIndex = '5000';
        document.body.appendChild(s);
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 200 + 100;
        s.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`, opacity: 0 }
        ], { duration: 1500 }).onfinish = () => s.remove();
    }
}

// BIND TO WINDOW
window.checkLogin = checkLogin;
window.handleAnswer = handleAnswer;
window.toggleMusic = toggleMusic;
window.closeFlyingCard = closeFlyingCard;
window.blowOutCandles = blowOutCandles;
window.spinWheel = spinWheel;
window.goToBirthday = goToBirthday;
