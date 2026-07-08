/**
 * The Coding Oracle (พ่อมดโค้ดดิ้ง)
 * Application Logic & Magical Energy Flow
 */

// -------------------------------------------------------------
// 1. Audio Synthesis Engine (Web Audio API)
// -------------------------------------------------------------
class MagicSoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setMuted(state) {
        this.muted = state;
        if (!state) {
            this.init();
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }
    }

    playTick() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playSparkle() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Arpeggio)
        
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + index * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);
            
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.35);
        });
    }

    playMysticalHum() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 1.5);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(111, this.ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(222, this.ctx.currentTime + 1.5);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.6);
        
        osc.start();
        osc2.start();
        osc.stop(this.ctx.currentTime + 1.6);
        osc2.stop(this.ctx.currentTime + 1.6);
    }

    playDangerChime() {
        if (this.muted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }
}

const sounds = new MagicSoundEngine();

// -------------------------------------------------------------
// 2. Background Canvas Particle System
// -------------------------------------------------------------
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleSymbols = ['0', '1', '{', '}', '</>', '=>', '++', ';', '*', '[]'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 12 + 8;
        this.speed = Math.random() * 0.7 + 0.3;
        this.opacity = Math.random() * 0.4 + 0.15;
        this.symbol = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
        this.color = Math.random() > 0.5 ? '#a855f7' : '#06b6d4'; // Purple or Cyan
    }

    update() {
        this.y -= this.speed;
        if (this.y < -20) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px "Fira Code", monospace`;
        ctx.globalAlpha = this.opacity;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

// Populate particles
for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// -------------------------------------------------------------
// 3. Tab Navigation Logic
// -------------------------------------------------------------
const tabs = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        sounds.playTick();
        
        // Remove active class
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active-content'));
        
        // Add active class to clicked tab and target content
        tab.classList.add('active');
        const target = tab.getAttribute('data-tab');
        document.getElementById(target).classList.add('active-content');
    });
});

// Sound Toggle Logic
const soundToggle = document.getElementById('sound-toggle');
soundToggle.addEventListener('click', () => {
    const isMuted = soundToggle.classList.contains('active'); // active means currently NOT muted
    if (!isMuted) {
        soundToggle.classList.add('active');
        soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>ปิดเสียงเวทมนตร์</span>';
        sounds.setMuted(false);
        sounds.playSparkle(); // Play dynamic sound response
    } else {
        soundToggle.classList.remove('active');
        soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>เปิดเสียงเวทมนตร์</span>';
        sounds.setMuted(true);
    }
});

// -------------------------------------------------------------
// 4. Tarot / Oracle Card Data & Logic
// -------------------------------------------------------------
const oracleCards = [
    {
        title: "THE CLEAN CODE",
        icon: "fa-circle-check",
        type: "LEGENDARY GOOD",
        headline: "เขียนโค้ดลื่นไหล ไร้ข้อติดขัด",
        description: "ชะตาการเขียนโค้ดของท่านวันนี้พุ่งขึ้นสูงสุด เขียนฟังก์ชันเดียวผ่านฉลุย บั๊กไม่มาทักทาย เพื่อนร่วมทีมยกย่องเป็นดั่งผู้วิเศษ คอมไพล์ครั้งแรกก็รันผ่านราวกับมีเวทมนตร์ช่วยดลบันดาล!",
        luck: 99,
        bugRate: 2,
        tip: "ควรรีบแต่งฟีเจอร์เด็ดให้เสร็จในวันนี้ และอย่าลืมกดรีวิวโค้ดให้เพื่อนร่วมงานเพื่อส่งต่อความมั่งคั่งนี้",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" stroke="#06b6d4" stroke-width="2" fill="rgba(6,182,212,0.05)"/>
            <path d="M35 50L45 60L65 40" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="50" cy="50" r="38" stroke="#a855f7" stroke-width="1" stroke-dasharray="4 4" />
        </svg>`
    },
    {
        title: "THE STACK OVERFLOW",
        icon: "fa-stack-overflow",
        type: "GRACEFUL HELP",
        headline: "ปัญญาญาณจากศาลพระภูมิโปรแกรมเมอร์",
        description: "วันนี้ท่านจะได้พบกับคำตอบที่กำลังค้นหาในบอร์ดอันศักดิ์สิทธิ์ มีโปรแกรมเมอร์ชาวอินเดียที่เขียนคำตอบทิ้งไว้เมื่อ 8 ปีที่แล้วตอบโจทย์ท่านพอดีอย่างน่ามหัศจรรย์ จงกราบไหว้และก็อปปี้โค้ดนั้นมาปรับใช้โดยด่วน",
        luck: 85,
        bugRate: 15,
        tip: "สวดอ้อนวอนผู้ใช้นามแฝงในบอร์ดอย่างสุภาพ และอย่าลืมกด Upvote คำตอบหากมันช่วยชีวิตคุณไว้",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="8" stroke="#f59e0b" stroke-width="2" fill="rgba(245,158,11,0.05)"/>
            <path d="M35 60H65M37 50L63 53M42 40L64 48M50 31L67 43" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
        </svg>`
    },
    {
        title: "THE BUG IN PRODUCTION",
        icon: "fa-bug",
        type: "CRITICAL WARNING",
        headline: "ฝันร้ายรันไทม์ โค้ดรั่วไหล",
        description: "คำเตือนสูงสุด! มีสิ่งลี้ลับซ่อนตัวอยู่ในโค้ดที่รันผ่านเครื่องคุณ (Local) แต่มันจะไปตายเมื่อขึ้นระบบจริง (Staging/Production) ชะตากรรมบอกว่าเกิดจากลืมใส่ Env variable หรือการกำหนดสิทธิ์การเข้าถึงไฟล์",
        luck: 25,
        bugRate: 95,
        tip: "ตรวจเช็ก Docker config หรือ Environment variables ให้ละเอียดสามรอบก่อนปิดงานกลับบ้าน",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="25" fill="none" stroke="#ef4444" stroke-width="2"/>
            <path d="M50 20V80M20 50H80M30 30L70 70M30 70L70 30" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="50" r="10" fill="#ef4444"/>
        </svg>`
    },
    {
        title: "THE MERGE CONFLICT",
        icon: "fa-code-compare",
        type: "BATTLE FOR LIFE",
        headline: "สงครามแย่งชิงบรรทัดโค้ด",
        description: "วันนี้เป็นวันมหาศึกแห่ง Git. เพื่อนร่วมทีมของคุณได้แก้ไขโค้ดบรรทัดเดียวกับคุณในไฟล์หลัก และเมื่อคุณกด Pull... ตู้ม! การต่อสู้ปะทุขึ้นในรูปแบบเครื่องหมาย <<<<<<< HEAD จงรวบรวมสติ คุยกันอย่างสันติ และเคลียร์ปัญหานี้ไปด้วยกัน",
        luck: 45,
        bugRate: 60,
        tip: "หลีกเลี่ยงการใช้คำสั่ง git push --force เป็นอันขาด มิเช่นนั้นชะตากรรมจะขาดสะบั้นร่วมกันหมด",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="8" stroke="#ec4899" stroke-width="3"/>
            <circle cx="30" cy="70" r="8" stroke="#06b6d4" stroke-width="3"/>
            <circle cx="70" cy="50" r="8" stroke="#a855f7" stroke-width="3"/>
            <path d="M30 38V62M38 30C50 30 50 48 62 48M38 70C50 70 50 52 62 52" stroke="#e2e8f0" stroke-width="2"/>
        </svg>`
    },
    {
        title: "THE COFFEE SYNERGY",
        icon: "fa-mug-hot",
        type: "BOOSTED MAGIC",
        headline: "คาเฟอีนสูบฉีด พลังเวทพุ่งทะลุ",
        description: "การแฟรสชาติเข้มข้นในเช้าวันนี้จะช่วยกระตุ้นสมองส่วนสร้างสรรค์ ค้นหาตรรกะที่คิดไม่ออกมาสามวันได้ในชั่วพริบตา นิ้วมือจะรัวคีย์บอร์ดเร็วกว่าเสียงหัวใจเต้น บั๊กใดๆ ก็ไม่สามารถต้านพลังแห่งเมล็ดกาแฟคั่วเข้มได้",
        luck: 90,
        bugRate: 10,
        tip: "จงดื่มในปริมาณที่พอเหมาะ อย่าเกินสองแก้ว มิฉะนั้นมือสั่นรัวเขียนโค้ดเพิ่มบั๊กโดยไม่ตั้งใจ",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40H65C70 40 70 48 65 48H30V40Z" fill="none" stroke="#f59e0b" stroke-width="3"/>
            <path d="M25 40V70C25 76 33 80 43 80H52C62 80 70 76 70 70V40H25Z" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" stroke-width="3"/>
            <path d="M70 47C75 47 80 50 80 55C80 60 75 63 70 63" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
            <path d="M38 28Q41 20 38 15M48 28Q51 20 48 15M58 28Q61 20 58 15" stroke="#ec4899" stroke-width="2" stroke-linecap="round"/>
        </svg>`
    },
    {
        title: "THE DEADLOCK",
        icon: "fa-lock",
        type: "CURSE OF PAUSE",
        headline: "ทางตันแห่งทรัพยากร ระบบค้างเติ่ง",
        description: "สัจธรรมความชะงักงัน วันนี้คุณอาจพบเจอกับสถานการณ์ที่พูดคุยกับแผนกอื่นไม่ลงตัว หรือโค้ดของคุณพยายามรอคอยข้อมูลจาก API ที่ไม่มีทางส่งมา ชีวิตโปรแกรมเมอร์วันนี้ต้องใช้ความอดทนสูงมาก เพราะงานเกือบทั้งหมดจะชะงัก",
        luck: 15,
        bugRate: 80,
        tip: "ห้ามฝืนนั่งจ้องหน้าจอ ให้เดินออกไปเดินเล่น สูดอากาศ หรือเปลี่ยนโหมดไปเขียนรีพอร์ตเบาๆ แทน",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="45" width="50" height="35" rx="6" stroke="#ef4444" stroke-width="3" fill="rgba(239,68,68,0.1)"/>
            <path d="M35 45V32C35 23 41 18 50 18C59 18 65 23 65 32V45" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
            <circle cx="50" cy="62" r="5" fill="#ef4444"/>
        </svg>`
    },
    {
        title: "THE REFACTOR SPIRIT",
        icon: "fa-wand-magic-sparkles",
        type: "DIVINE CLEANSE",
        headline: "คืนชีพโค้ดเก่า ปลดปล่อยจิตวิญญาณ",
        description: "ถึงเวลาทำความสะอาดโค้ดมรดกพันปี (Legacy Code) ที่ไม่มีใครกล้าแตะ วันนี้จิตใจวิญญาณพ่อมดโค้ดดิ่งของคุณจะสงบนิ่งพอที่จะแยกชิ้นส่วนโค้ดซับซ้อนให้กลายเป็นโมดูลสวยงามและอ่านง่าย สลัดคราบสปาเก็ตตี้โค้ดออกไป",
        luck: 88,
        bugRate: 35,
        tip: "อย่าลืมรัน Unit Tests ควบคู่ไปด้วยทุกๆ ครั้งหลังการลบหรือปรับโครงสร้างฟังก์ชัน",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 75L70 35M70 35L60 25M70 35L80 45" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
            <path d="M25 25L30 30M28 15L28 20M15 28L20 28" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
            <path d="M75 75L80 80M78 65L78 70M65 78L70 78" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
        </svg>`
    },
    {
        title: "THE LEGACY SYSTEM",
        icon: "fa-monument",
        type: "DARK ANCIENT FORCE",
        headline: "ระบบโบราณคดีที่ไร้คู่มือ",
        description: "ท่านกำลังเผชิญหน้ากับปีศาจร้ายโบราณกาล ระบบที่เขียนขึ้นด้วยภาษาเก๋ากึ๊ก ไม่มี Documentation และคนที่เขียนลาออกไปแล้ว 5 ปี วันนี้โค้ดที่ขยับนิดเดียวก็พร้อมจะพังลงทั้งระบบเหมือนโดนคำสาป",
        luck: 30,
        bugRate: 78,
        tip: "ก่อนลงมือแตะต้อง จงอธิษฐานจิตดีๆ และสร้าง Branch สำรองเผื่อชีวิตพังเพื่อย้อนกลับมาจุดเริ่ม",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 85V40C30 30 40 20 50 20C60 20 70 30 70 40V85H30Z" stroke="#e2e8f0" stroke-width="3" fill="rgba(255,255,255,0.02)"/>
            <line x1="20" y1="85" x2="80" y2="85" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
            <path d="M45 45H55M40 55H60M42 65H58" stroke="#a855f7" stroke-width="2"/>
        </svg>`
    }
];

// Interactive Card Back Elements
const cardBacks = document.querySelectorAll('.magic-card-back');
const modalOverlay = document.getElementById('card-result-modal');
const closeModalBtn = document.getElementById('close-result');
const tryAgainCardsBtn = document.getElementById('try-again-cards');

// Card elements to change
const cardIcon = document.getElementById('result-card-icon');
const cardTitle = document.getElementById('result-card-title');
const cardType = document.getElementById('result-card-type');
const cardSvgContainer = document.getElementById('card-svg-container');
const cardHeadline = document.getElementById('result-headline');
const cardDescription = document.getElementById('result-description');
const statLuck = document.getElementById('stat-luck');
const statBugs = document.getElementById('stat-bugs');
const cardTip = document.getElementById('result-tip');

cardBacks.forEach(cardBack => {
    cardBack.addEventListener('click', () => {
        // Trigger draw effect
        sounds.playSparkle();
        
        // Randomly select card
        const randomIndex = Math.floor(Math.random() * oracleCards.length);
        const cardData = oracleCards[randomIndex];
        
        // Apply card details to modal
        cardIcon.className = `fa-solid ${cardData.icon}`;
        cardTitle.textContent = cardData.title;
        cardType.textContent = cardData.type;
        cardSvgContainer.innerHTML = cardData.svg;
        cardHeadline.textContent = cardData.headline;
        cardDescription.textContent = cardData.description;
        
        // Adjust badge styles depending on type
        if (cardData.type.includes("GOOD") || cardData.type.includes("BOOSTED")) {
            cardType.style.borderColor = "var(--magic-success)";
            cardType.style.color = "var(--magic-success)";
            cardType.style.backgroundColor = "rgba(16, 185, 129, 0.15)";
        } else if (cardData.type.includes("WARNING") || cardData.type.includes("CURSE") || cardData.type.includes("DARK")) {
            cardType.style.borderColor = "var(--magic-danger)";
            cardType.style.color = "var(--magic-danger)";
            cardType.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
        } else {
            cardType.style.borderColor = "var(--magic-cyan)";
            cardType.style.color = "var(--magic-cyan)";
            cardType.style.backgroundColor = "rgba(6, 182, 212, 0.15)";
        }
        
        // Update stats
        statLuck.style.width = `${cardData.luck}%`;
        statBugs.style.width = `${cardData.bugRate}%`;
        
        if (cardData.bugRate > 60) {
            statBugs.className = "fill danger";
        } else {
            statBugs.className = "fill";
        }
        
        cardTip.textContent = cardData.tip;
        
        // Show Modal
        modalOverlay.classList.remove('hidden');
        
        // 3D Reveal Flip Animation simulation
        const innerCard = document.querySelector('.flip-card-inner');
        innerCard.style.transform = 'rotateY(0)';
        setTimeout(() => {
            innerCard.style.transform = 'rotateY(360deg)';
        }, 100);
    });
});

// Close Modal logic
function closeModal() {
    sounds.playTick();
    modalOverlay.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
tryAgainCardsBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// -------------------------------------------------------------
// 5. Programming Language Horoscope Data & Logic
// -------------------------------------------------------------
const langHoroscopes = {
    javascript: {
        name: "JavaScript Horoscope",
        icon: "fa-js",
        color: "#f7df1e",
        ideTheme: "SynthWave '84 (เรืองแสงแสบตา ทะลุมิติ)",
        drink: "Energy Drink ผสมกาแฟ 3 ช็อต (เร่งรีบแซงคิว)",
        warning: "เขียนตัวแปรแบบ global หรือใช้ console.log ทิ้งไว้บนสเตจจริง",
        prediction: "วันนี้อิทธิพลของ Callback Hell และ Promises จะทำมุมตรงข้ามกัน ดวงชะตาบอกว่ามีสิทธิ์จะเขียนโค้ดที่ขยายตัวไวเปรียบเสมือนเวทมนตร์แบ่งร่าง หากมีโปรเจกต์ใหม่ให้ระวังการติดตั้ง node_modules เกิน 2 กิกะไบต์ เครื่องจะค้างชั่วขณะ"
    },
    python: {
        name: "Python Horoscope",
        icon: "fa-python",
        color: "#3776ab",
        ideTheme: "One Dark Pro (สวยสะกดตา คมชัดทุกย่อหน้า)",
        drink: "ชาเขียวมัทฉะร้อน (สงบเงียบ เยือกเย็น วางแผนรอบคอบ)",
        warning: "การเว้นวรรค IndentationError หายไปหนึ่งช่องจนบิลด์ไม่ผ่าน",
        prediction: "พลังแห่งความเรียบง่ายและคลีนโค้ดกำลังนำดวงชะตาของท่านวันนี้ คาถาล่าสัตว์อสรพิษกำลังเปล่งแสง คุณจะสามารถสร้างโมเดลวิเคราะห์ข้อมูลหรือสคริปต์สแกนเว็บเสร็จในพริบตา แต่อย่าประมาทกับไฟล์ config.ini ที่เขียนลืมทิ้งไว้"
    },
    go: {
        name: "Go Horoscope",
        icon: "fa-golang",
        color: "#00add8",
        ideTheme: "Dracula (มืดมนสยบความเร็ว คล่องตัวสูง)",
        drink: "Espresso Short (เร่งด่วน ไร้ขยะ มีแต่เนื้อๆ)",
        warning: "การละเลยไม่เช็ก 'if err != nil' แล้วปล่อยปละละเลยผ่านไป",
        prediction: "โกเลมแห่งความเร็วรันไทม์คุ้มครองท่าน! ระบบ concurrency (Goroutines) วันนี้ของคุณจะมีความไหลลื่นสูงสุด รันงานหนักได้ดีดั่งอัศวินสวมเกราะ แต่ขอให้รอบคอบเรื่องการแชร์ตัวแปรข้ามเธรด (Race Condition) เคลียร์บั๊กเรื่องชาแนลให้ดี"
    },
    rust: {
        name: "Rust Horoscope",
        icon: "fa-rust",
        color: "#dea584",
        ideTheme: "Gruvbox (แนวเรโทร คลาสสิก เข้มแข็งทนทาน)",
        drink: "น้ำอุ่นผสมมะนาว (ดูแลรักษาสุขภาพ ชำระสิ่งไม่สะอาด)",
        warning: "การทะเลาะกับ Borrow Checker ยาวนานจนถึงเวลากลางคืน",
        prediction: "ความดื้อรั้นของคอมไพเลอร์ที่สู้รบกับคุณช่วงเช้าจะกลายเป็นความปลอดภัยชะตาชีวิตรันไทม์ช่วงบ่าย หลังจากแก้บั๊กคอมไพเลอร์ผ่าน โค้ดของคุณจะแกร่งดั่งเกราะเหล็กไหลกล้า ไม่มีวันเกิด Null Pointer หรือ Memory Leak แน่นอน"
    },
    java: {
        name: "Java Horoscope",
        icon: "fa-java",
        color: "#f89820",
        ideTheme: "IntelliJ Darcula Classic (คัมภีร์ดึกดำบรรพ์ พลังสูงส่ง)",
        drink: "Americano ร้อนแก้วยักษ์ (ต้องความอดทนระยะยาวในการบดเมล็ด)",
        warning: "การตั้งชื่อคลาสยาวเกิน 80 ตัวอักษรจนจำสับสนเอง",
        prediction: "ดวงชะตาแบบอิงสัจธรรม Object-Oriented สูงส่ง คลาสต่างๆ ที่ผูกสัมพันธ์กันในวันนี้จะมีความเข้มแข็ง ปราศจากบั๊กแปลกปลอม แต่ระวังการประกาศ Exception ลอยๆ โดยไม่แคชไว้ งานจะไปกองพังตอนหัวหน้างานมาตรวจสอบ"
    },
    cpp: {
        name: "C++ Horoscope",
        icon: "fa-c",
        color: "#00599c",
        ideTheme: "Monokai Original (เฉียบคม แผดเผา พลังดิบ)",
        drink: "กาแฟดำไม่ใส่น้ำตาล Double Shot (ปลุกพลังประสาทขั้นสุด)",
        warning: "การทำ Segmentation Fault หายนะจากการจิ้มพอยน์เตอร์ผิดที่",
        prediction: "เหมือนเดินอยู่บนขอบเหวพร้อมดาบเล่มมหัศจรรย์ หากคุณมีสมาธิดี ดาบเล่มนี้จะช่วยทะลวงความเร็วระบบได้เร็วสุดยอด แต่ถ้าเสียสมาธิแม้แต่นิดเดียว ดาบนั้นจะย้อนมาฟันหน่วยความจำตัวเองขาดสะบั้น (Memory Leak) จงมีสติ"
    },
    php: {
        name: "PHP Horoscope",
        icon: "fa-php",
        color: "#777bb4",
        ideTheme: "Visual Studio Dark (คลาสสิก คุ้นมือ มั่นคง)",
        drink: "โกโก้เย็นหวานร้อย (เติมพลังความคุ้นเคยตั้งแต่เด็ก)",
        warning: "หลงลืมใส่เครื่องหมายดอลลาร์ไซน์ ($) นำหน้าตัวแปรตัวสำคัญ",
        prediction: "จอมอึดแห่งวงการไม่วันตาย! วันนี้หน้าเว็บเสกง่าย รันง่าย ไม่มีงอแง เหมาะแก่การรับงานฟรีแลนซ์เสริมสร้างรายได้พ่วงความมั่งคั่ง ดวงบอกว่าการคิวรี่ฐานข้อมูลเก่าๆ จะนำโชคลาภทางการเงินมาให้ในเร็ววัน"
    },
    typescript: {
        name: "TypeScript Horoscope",
        icon: "fa-square-check",
        color: "#3178c6",
        ideTheme: "Nord (เรียบหรู ดูแพง ปลอดภัย หนาวเย็นสะอาดตา)",
        drink: "Earl Grey Tea (สุภาพเรียบร้อย มีระเบียบวินัย)",
        warning: "การยัด 'any' ไส้ในลงไปเพื่อหนีการแจ้งเตือนสไตล์คนสิ้นคิด",
        prediction: "เกราะป้องกันประเภทข้อมูลจะโอบอุ้มชะตาคุณวันนี้ คุณจะพบปัญหาตั้งแต่เนิ่นๆ ก่อนโค้ดไปสู่หน้าลูกค้าร้องเรียน ช่วยผ่อนแรงไปได้อย่างยอดเยี่ยม แต่ระวังการใช้คาถา interface ซับซ้อนซ่อนเงื่อนเกินจำเป็นจะพางงกันหมด"
    },
    csharp: {
        name: "C# Horoscope",
        icon: "fa-windows",
        color: "#239120",
        ideTheme: "Visual Studio Professional Theme",
        drink: "Cappuccino อุ่นๆ โรยผงซินนามอน (อบอุ่น ทำงานราบรื่น)",
        warning: "การเรียกใช้ฟังก์ชันแบบ Sync ในที่ที่ควรจะเป็น Async",
        prediction: "ดวงการงานของคุณอยู่ภายใต้การคุ้มครองของจักรวรรดิอันยิ่งใหญ่ (Dotnet Core) วันนี้รันงานเสถียรดุจหินผา การเชื่อมโยงกับฐานข้อมูลไร้รอยต่อ ปราศจากวิญญาณชั่วร้าย แต่ระวังอย่าลืมอัปเดต NuGet packages ที่เสี่ยงโดนแฮก"
    },
    htmlcss: {
        name: "HTML/CSS Horoscope",
        icon: "fa-html5",
        color: "#e34c26",
        ideTheme: "Monokai Pro (Spectrum) - ปลุกพลังความงามศิลปะ",
        drink: "Cold Brew Juice Mocktail (สวยงาม มีสไตล์ พรีเมียม)",
        warning: "ลืมใส่ box-sizing: border-box หรือหลุดขอบหน้าจอสมาร์ทโฟน",
        prediction: "เทพีแห่งความงามสถิตอยู่ข้างตัวคุณ! วันนี้การจับวาง Flexbox หรือ Grid จะเป๊ะปังร้อยเปอร์เซ็นต์ ไม่บิด ไม่เบี้ยว จัดตำแหน่งกึ่งกลาง (Center a div) ได้ภายใน 5 วินาที ลูกค้าพึงพอใจในหน้าเว็บจนอยากโอนเงินเพิ่มทันที"
    }
};

const langSelect = document.getElementById('lang-select');
const viewHoroscopeBtn = document.getElementById('view-horoscope-btn');
const horoscopeResult = document.getElementById('horoscope-result');

const langResultIcon = document.getElementById('lang-result-icon');
const langResultName = document.getElementById('lang-result-name');
const langPredictionText = document.getElementById('lang-prediction-text');
const luckyColorHex = document.getElementById('lucky-color-hex');
const luckyColorPreview = document.getElementById('lucky-color-preview');
const luckyIdeTheme = document.getElementById('lucky-ide-theme');
const luckyDrink = document.getElementById('lucky-drink');
const badWarning = document.getElementById('bad-warning');

// Enable button when select changes
langSelect.addEventListener('change', () => {
    viewHoroscopeBtn.classList.remove('disabled');
    viewHoroscopeBtn.removeAttribute('disabled');
    sounds.playTick();
});

viewHoroscopeBtn.addEventListener('click', () => {
    if (viewHoroscopeBtn.classList.contains('disabled')) return;
    
    // Play sound depending on random or language
    sounds.playSparkle();
    
    const selectedValue = langSelect.value;
    const horoscope = langHoroscopes[selectedValue];
    
    if (horoscope) {
        // Set values
        langResultIcon.className = `fa-brands ${horoscope.icon}`;
        
        // Handle custom classes for icon styling
        if (selectedValue === 'typescript' || selectedValue === 'cpp') {
            langResultIcon.className = `fa-solid ${horoscope.icon}`;
        }
        
        langResultIcon.style.color = horoscope.color;
        langResultName.textContent = horoscope.name;
        langPredictionText.textContent = horoscope.prediction;
        luckyColorHex.textContent = horoscope.color;
        luckyColorPreview.style.backgroundColor = horoscope.color;
        luckyIdeTheme.textContent = horoscope.ideTheme;
        luckyDrink.textContent = horoscope.drink;
        badWarning.textContent = horoscope.warning;
        
        // Reveal result block with class change
        horoscopeResult.classList.remove('hidden');
        
        // Smooth scroll to result
        horoscopeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});

// -------------------------------------------------------------
// 6. Bug Crystal Ball Logic (Q&A)
// -------------------------------------------------------------
const crystalBall = document.getElementById('crystal-ball-interactive');
const crystalText = document.getElementById('crystal-text');
const questionInput = document.getElementById('question-input');
const askBallBtn = document.getElementById('ask-ball-btn');

const oracleAnswers = [
    "คาดการณ์ว่า... คืนนี้คุณจะได้เลิกงานเร็ว 3 ชั่วโมง แต่โค้ดต้องเสร็จนะ!",
    "เหล่านักพัฒนาในอดีตบอกว่า: 'จงเปลี่ยนชื่อตัวแปรเป็น temp แล้วบั๊กจะคลี่คลาย'",
    "พลังงานเวทมนตร์อ่อนเกินไปที่จะประมวลผลคำตอบ... ลองกด F5 รีเฟรชชีวิตคุณใหม่",
    "คอมไพเลอร์กำลังบอกคุณทางอ้อมว่า 'โค้ดนี้มันยอดเยี่ยมแล้ว... สำหรับการทำลายล้างโลก'",
    "สัญญาณชีพของเซิร์ฟเวอร์บ่งชี้ว่า: มีโอกาสล่ม 99.9% หากไม่ตรวจเช็กหน่วยความจำก่อนกด Deploy",
    "คำตอบซ่อนอยู่ในกล่องเป็ดเหลืองข้างๆ คุณ ลองคุยกับมันดีๆ แล้วคุณจะรู้หนทางแก้กรรม",
    "วันนี้ห้ามขยับตัวแปรหรือย้ายฟังก์ชันสำคัญเด็ดขาด! โค้ดมีโครงสร้างเปราะบางดั่งปราสาททราย",
    "จงกราบไหว้เป็ดของคุณ 3 หน แล้วคำตอบจะสว่างวาบขึ้นมาในห้วงลึกของสมอง",
    "ชะตาของคุณจะดีขึ้นทันทีถ้าคุณหยุดดูมุกมีมโปรแกรมเมอร์แล้วตั้งใจเขียนโค้ดต่อ",
    "สี่ทุ่มคืนนี้จะมีทางสว่างปรากฏเมื่อมีผู้มีบุญจาก StackOverflow ชี้แนะแนวทาง",
    "มีโอกาสเกิดไฟดับหรือคอมพิวเตอร์รีบูตโดยไม่ตั้งใจ จงหมั่นกด Ctrl+S ทุกๆ วินาที",
    "คำเตือน: คุณกำลังขี่เสือที่ชื่อว่า Legacy Code อย่าปล่อยมือไม่งั้นโดนแทงหลังแน่นอน",
    "ดวงชะตานี้บอกว่า... บั๊กตัวนี้แก้ได้ด้วยการกดลบโค้ดแล้วเขียนขึ้นใหม่ทั้งหมดใน 10 นาที"
];

let isCasting = false;

function castOracle() {
    if (isCasting) return;
    
    const question = questionInput.value.trim();
    if (!question) {
        sounds.playDangerChime();
        crystalText.innerHTML = "<span style='color: var(--magic-pink)'>กรุณาตั้งจิตอธิษฐานแล้วใส่คำถามก่อนแตะลูกแก้ว!</span>";
        return;
    }
    
    isCasting = true;
    crystalBall.classList.add('casting');
    sounds.playMysticalHum();
    
    crystalText.textContent = "กำลังวิเคราะห์จิตวิญญาณแห่งรันไทม์...";
    
    // Simulate thinking/vibrating ball
    setTimeout(() => {
        // Pick random answer
        const randomAns = oracleAnswers[Math.floor(Math.random() * oracleAnswers.length)];
        
        // Typewriter effect
        crystalText.textContent = "";
        let i = 0;
        
        function typeWriter() {
            if (i < randomAns.length) {
                crystalText.textContent += randomAns.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                isCasting = false;
                crystalBall.classList.remove('casting');
            }
        }
        
        typeWriter();
    }, 1800);
}

// Event Listeners for crystal ball
crystalBall.addEventListener('click', castOracle);
askBallBtn.addEventListener('click', castOracle);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        castOracle();
    }
});
