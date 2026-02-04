// 共享配置和功能

// 全局变量
let canvas, ctx;
let fireworks = [];
let particles;
let bgParticles = [];

// 初始化 canvas
function initCanvas() {
    canvas = document.getElementById('fireworksCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    fireworks = [];
    
    // 初始化悬浮粒子
    bgParticles = [];
    for (let i = 0; i < 50; i++) {
        bgParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '#FFD700' : '#C41E3A',
            alpha: Math.random() * 0.5 + 0.3
        });
    }
    
    // 设置 canvas 大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.removeEventListener('resize', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

// 烟花颜色
const colors = [
    '#FFD700', // 金色
    '#C41E3A', // 红色
    '#00CED1', // 青色
    '#FF69B4', // 粉色
    '#00CED1'  // 深青色
];

// 创建烟花
function createFirework() {
    if (!canvas) return;
    
    const x = Math.random() * canvas.width;
    const targetY = Math.random() * (canvas.height * 0.5);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    fireworks.push({
        x: x,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -12 - Math.random() * 3,
        color: color,
        trail: [],
        exploded: false,
        radius: 3
    });
}

// 创建爆炸粒子
function createExplosionParticles(x, y, color) {
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i;
        const velocity = 2 + Math.random() * 3;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            color: color,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            radius: 2,
            alpha: 1
        });
    }
}

// 动画循环
function animate() {
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    updateBgParticles();
    drawBgParticles();
    
    updateFireworks();
    drawFireworks();
    
    updateParticles();
    drawParticles();
    
    requestAnimationFrame(animate);
}

// 更新烟花
function updateFireworks() {
    fireworks.forEach((fw, index) => {
        fw.trail.push({ x: fw.x, y: fw.y });
        if (fw.trail.length > 10) fw.trail.shift();
        
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.1;
        
        if (!fw.exploded && fw.vy >= 0) {
            fw.exploded = true;
            createExplosionParticles(fw.x, fw.y, fw.color);
            fireworks.splice(index, 1);
        }
    });
}

// 绘制烟花
function drawFireworks() {
    fireworks.forEach(fw => {
        // 绘制轨迹
        fw.trail.forEach((point, i) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, fw.radius * (i / fw.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.globalAlpha = i / fw.trail.length * 0.5;
            ctx.fill();
        });
        
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
        ctx.fillStyle = fw.color;
        ctx.globalAlpha = 1;
        ctx.fill();
    });
}

// 更新粒子
function updateParticles() {
    if (!particles) return;
    
    particles = particles.filter(p => {
        if (p.decay) {
            // 爆炸粒子
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= p.decay;
            
            if (p.life <= 0) return false;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        return true;
    });
}

// 绘制粒子
function drawParticles() {
    if (!particles) return;
    
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

// 更新背景粒子
function updateBgParticles() {
    if (!canvas) return;
    
    bgParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
}

// 绘制背景粒子
function drawBgParticles() {
    if (!canvas) return;
    
    bgParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

// 启动动画
function startAnimation() {
    if (window.animationRunning) return;
    window.animationRunning = true;
    animate();
}

// 自动发射烟花
function startFireworks() {
    setInterval(() => {
        if (fireworks && fireworks.length < 3) {
            createFirework();
        }
    }, 2000);
}

// 对联数据
const COUPLETS = [
    { left: '新春大吉', right: '万事如意' },
    { left: '年味浓浓', right: '喜气洋洋' },
    { left: '年兽不扰人间乐', right: '春风常暖万家心' },
    { left: '爆竹声中一岁除', right: '春风送暖入屠苏' },
    { left: '年去年来春常在', right: '花落花开景更新' },
    { left: '喜看三春添秀色', right: '笑迎四化展宏图' },
    { left: '年兽惊惧红联现', right: '春意盎然福运来' },
    { left: '春回大地千山秀', right: '日暖神州万木荣' }
];

let currentCoupletIndex = 0;

// 初始化对联
function initCouplet() {
    const leftText = document.getElementById('coupletLeftText');
    const rightText = document.getElementById('coupletRightText');
    
    if (!leftText || !rightText) return;
    
    // 首次加载显示本地对联
    const couplet = COUPLETS[0];
    leftText.textContent = couplet.left;
    rightText.textContent = couplet.right;
    
    // 2秒后开始尝试 AI 生成
    setTimeout(() => {
        updateCouplet();
        setInterval(updateCouplet, 30000);
    }, 2000);
}

// 更新对联
function updateCouplet() {
    const leftText = document.getElementById('coupletLeftText');
    const rightText = document.getElementById('coupletRightText');
    const loadingIndicator = document.getElementById('coupletLoading');
    
    if (!leftText || !rightText) return;
    
    // 显示加载状态
    if (loadingIndicator) {
        loadingIndicator.classList.add('active');
    }
    
    // 先显示下一副本地对联
    currentCoupletIndex = (currentCoupletIndex + 1) % COUPLETS.length;
    const localCouplet = COUPLETS[currentCoupletIndex];
    leftText.textContent = localCouplet.left;
    rightText.textContent = localCouplet.right;
    
    // 尝试 AI 生成对联
    generateCoupletWithAI().then((couplet) => {
        if (couplet) {
            leftText.textContent = couplet.left;
            rightText.textContent = couplet.right;
        }
        if (loadingIndicator) {
            loadingIndicator.classList.remove('active');
        }
    }).catch(() => {
        if (loadingIndicator) {
            loadingIndicator.classList.remove('active');
        }
    });
}

// AI 生成对联
async function generateCoupletWithAI() {
    const apiUrl = localStorage.getItem('nianshou_api_url');
    const apiKey = localStorage.getItem('nianshou_api_key');
    const modelName = localStorage.getItem('nianshou_model_name');
    
    if (!apiUrl || !apiKey) {
        return null;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${apiUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个创作春节对联的专家。请创作一副春节对联，要求：1. 上下联字数相等；2. 对仗工整；3. 平仄协调；4. 意境优美；5. 与春节、年兽、新年相关。请直接返回对联，格式为：上联：[内容]\n下联：[内容]'
                    },
                    {
                        role: 'user',
                        content: '请创作一副春节对联'
                    }
                ],
                max_tokens: 200,
                temperature: 0.8
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('API 请求失败');
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 解析对联
        const lines = content.split('\n').filter(line => line.trim());
        let left = '';
        let right = '';
        
        for (const line of lines) {
            if (line.includes('上联')) {
                left = line.replace(/上联[：:]\s*/, '').trim();
            } else if (line.includes('下联')) {
                right = line.replace(/下联[：:]\s*/, '').trim();
            }
        }
        
        if (!left || !right) {
            const matches = content.match(/([^\n]+)/g);
            if (matches && matches.length >= 2) {
                left = matches[0].trim();
                right = matches[1].trim();
            }
        }
        
        if (left && right) {
            return { left, right };
        }
        
        return null;
    } catch (error) {
        console.log('AI 生成对联失败，使用本地数据:', error);
        return null;
    }
}

// 倒计时功能
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    const now = new Date();
    
    const springFestivalDates = {
        2025: new Date(2025, 0, 29),
        2026: new Date(2026, 1, 17),
        2027: new Date(2027, 1, 6),
        2028: new Date(2028, 0, 26),
        2029: new Date(2029, 1, 13),
        2030: new Date(2030, 1, 3),
    };
    
    let springFestival = springFestivalDates[2026];
    let festivalYear = 2026;
    
    if (now > springFestival) {
        springFestival = springFestivalDates[2027];
        festivalYear = 2027;
    }
    
    const diff = springFestival - now;
    
    if (diff <= 0) {
        document.getElementById('countdownDays').textContent = '0';
        document.getElementById('countdownHours').textContent = '0';
        document.getElementById('countdownMinutes').textContent = '0';
        document.getElementById('countdownSeconds').textContent = '0';
        
        const label = document.querySelector('.countdown-container h2');
        if (label) {
            label.textContent = `🎉 ${festivalYear}年春节快乐！`;
        }
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('countdownDays').textContent = days;
    document.getElementById('countdownHours').textContent = hours;
    document.getElementById('countdownMinutes').textContent = minutes;
    document.getElementById('countdownSeconds').textContent = seconds;
}

// 配置管理
const STORAGE_KEYS = {
    API_URL: 'nianshou_api_url',
    API_KEY: 'nianshou_api_key',
    MODEL_NAME: 'nianshou_model_name'
};

// 初始化配置模态框
function initConfigModal() {
    const configBtn = document.getElementById('configBtn');
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('configModal');
    
    if (!configBtn || !closeModal || !modal) return;
    
    configBtn.addEventListener('click', () => {
        modal.classList.add('show');
        loadConfig();
    });
    
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
    
    // 表单提交
    const configForm = document.getElementById('configForm');
    if (configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const apiUrl = document.getElementById('apiUrl').value.trim();
            const apiKey = document.getElementById('apiKey').value.trim();
            const modelName = document.getElementById('modelName').value.trim();
            
            if (!apiUrl || !apiKey || !modelName) {
                showConfigStatus('请填写所有配置项', 'error');
                return;
            }
            
            localStorage.setItem(STORAGE_KEYS.API_URL, apiUrl);
            localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
            localStorage.setItem(STORAGE_KEYS.MODEL_NAME, modelName);
            
            showConfigStatus('✅ 配置已保存到本地存储', 'success');
            
            setTimeout(() => {
                modal.classList.remove('show');
            }, 2000);
        });
    }
}

// 加载配置
function loadConfig() {
    const apiUrlInput = document.getElementById('apiUrl');
    const apiKeyInput = document.getElementById('apiKey');
    const modelNameInput = document.getElementById('modelName');
    
    if (apiUrlInput) {
        apiUrlInput.value = localStorage.getItem(STORAGE_KEYS.API_URL) || 'https://apis.iflow.cn/v1';
    }
    if (apiKeyInput) {
        apiKeyInput.value = localStorage.getItem(STORAGE_KEYS.API_KEY) || 'sk-addf2e0ca78c6b7d287bd1ae039bc28a';
    }
    if (modelNameInput) {
        modelNameInput.value = localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || 'iflow-rome-30ba3b';
    }
}

// 显示配置状态
function showConfigStatus(message, type) {
    const statusDiv = document.getElementById('configStatus');
    if (!statusDiv) return;
    
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    startAnimation();
    startFireworks();
    initCouplet();
    if (document.getElementById('countdown')) {
        initCountdown();
    }
    initConfigModal();
});