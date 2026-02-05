// 故事生成器专用脚本

// 成就定义
const ACHIEVEMENTS = {
    first_story: { name: '初试年兽', desc: '创作你的第一个年兽故事', icon: '🎉' },
    traditional_style: { name: '传统传承', desc: '使用传统神话风格创作', icon: '📜' },
    humorous_style: { name: '欢乐时光', desc: '使用幽默搞笑风格创作', icon: '😄' },
    adventure_style: { name: '勇敢探索', desc: '使用冒险探险风格创作', icon: '🗺️' },
    warm_style: { name: '温暖心灵', desc: '使用温馨治愈风格创作', icon: '💝' },
    mystery_style: { name: '悬疑侦探', desc: '使用悬疑解谜风格创作', icon: '🔍' },
    child_friendly: { name: '童心未泯', desc: '创作适合儿童的故事', icon: '👶' },
    teen_friendly: { name: '青春飞扬', desc: '创作适合青少年的故事', icon: '🎓' },
    adult_friendly: { name: '成熟故事', desc: '创作适合成人的故事', icon: '🧑' },
    storyteller_5: { name: '故事家', desc: '累计创作5个故事', icon: '📚' },
    storyteller_10: { name: '传奇作家', desc: '累计创作10个故事', icon: '👑' }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initModal();
    initAchievementModal();
    initHistoryModal();
    initCharCounter();
    loadAchievements();
    initGenerateStory();
});

// 初始化字符计数器
function initCharCounter() {
    const textarea = document.getElementById('storyPrompt');
    const charCount = document.getElementById('charCount');
    const maxLength = 500;
    
    if (!textarea || !charCount) return;
    
    const updateCount = () => {
        const currentLength = textarea.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength >= maxLength) {
            charCount.style.color = 'var(--error)';
        } else {
            charCount.style.color = 'var(--primary-red)';
        }
    };
    
    textarea.addEventListener('input', updateCount);
    updateCount();
}

// 初始化模态框
function initModal() {
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
}

// 加载配置
function loadConfig() {
    document.getElementById('apiUrl').value = localStorage.getItem(STORAGE_KEYS.API_URL) || 'https://apis.iflow.cn/v1';
    document.getElementById('apiKey').value = localStorage.getItem(STORAGE_KEYS.API_KEY) || 'sk-addf2e0ca78c6b7d287bd1ae039bc28a';
    document.getElementById('modelName').value = localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || 'iflow-rome-30ba3b';
}

// 保存配置
document.getElementById('configForm').addEventListener('submit', (e) => {
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
        document.getElementById('configModal').classList.remove('show');
    }, 2000);
});

// 显示配置状态
function showConfigStatus(message, type) {
    const statusDiv = document.getElementById('configStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// 生成故事
function initGenerateStory() {
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', async () => {
        const prompt = document.getElementById('storyPrompt').value.trim();
        const style = document.getElementById('storyStyle').value;
        const ageRange = document.getElementById('ageRange').value;
        const apiUrl = localStorage.getItem(STORAGE_KEYS.API_URL);
        const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
        const modelName = localStorage.getItem(STORAGE_KEYS.MODEL_NAME);
        
        if (!apiUrl || !apiKey) {
            showStoryError('请先点击右上角"⚙️"按钮进行配置');
            return;
        }
        
        if (!prompt) {
            showStoryError('请输入故事提示词');
            return;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
            showLoading(true);
            
            const styleDescriptions = {
                'traditional': '传统神话风格：使用古典的叙事方式，融入神话元素和传说色彩',
                'humorous': '幽默搞笑风格：轻松诙谐，富有童趣和幽默感',
                'adventure': '冒险探险风格：充满悬念和冒险元素，情节跌宕起伏',
                'warm': '温馨治愈风格：温暖感人，注重情感表达和治愈力量',
                'mystery': '悬疑解谜风格：带有神秘色彩，需要年兽或主人公通过智慧解开谜团'
            };
            
            const ageDescriptions = {
                '3-6': '适合3-6岁幼儿：语言简单，情节温馨，多用拟声词，篇幅控制在200字以内',
                '7-12': '适合7-12岁儿童：故事情节生动有趣，人物形象鲜明，有一定的想象力',
                '13-18': '适合13-18岁青少年：情节有一定的深度，寓意深刻，语言表达较为成熟',
                'adult': '适合成人：内容丰富，思想深刻，语言表达老练，具有文学性'
            };
            
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
                            content: `你是一个专门创作年兽故事的作家。严格规则：1. 只能创作关于年兽的故事，年兽必须是故事的核心角色；2. 故事背景必须设定在春节时期或与春节习俗相关；3. 不得偏离年兽主题，不能写成其他动物或角色的故事；4. 用生动、有趣的风格创作；5. 如果用户提示词与年兽无关，请拒绝并说明"我只能创作年兽相关的春节故事"。\n\n${styleDescriptions[style] || ''}\n\n${ageDescriptions[ageRange] || ''}`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.8
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            const story = data.choices[0].message.content;
            
            displayStory(story);
            saveStoryToHistory(story, style, ageRange);
            
            // 更新故事计数
            const count = parseInt(localStorage.getItem(STORAGE_KEYS.STORY_COUNT) || '0') + 1;
            localStorage.setItem(STORAGE_KEYS.STORY_COUNT, count.toString());
            
            // 解锁成就
            unlockAchievement('first_story');
            const styleAchievement = getStyleAchievementId(style);
            if (styleAchievement) {
                unlockAchievement(styleAchievement);
            }
            const ageAchievement = getAgeAchievementId(ageRange);
            if (ageAchievement) {
                unlockAchievement(ageAchievement);
            }
            checkStoryCountAchievements();
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            let errorMessage = '生成失败';
            if (error.name === 'AbortError') {
                errorMessage = '请求超时，请检查网络连接后重试';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = '网络连接失败，请检查 API URL 是否正确';
            } else {
                errorMessage = `生成失败: ${error.message}`;
            }
            
            showStoryError(errorMessage);
        } finally {
            showLoading(false);
        }
    });
}

// 显示加载状态
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const generateBtn = document.getElementById('generateBtn');
    
    if (show) {
        spinner.style.display = 'block';
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ 生成中...';
    } else {
        spinner.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ 生成故事';
    }
}

// 显示故事
function displayStory(story) {
    const outputDiv = document.getElementById('storyOutput');
    outputDiv.innerHTML = `
        <div class="story-content">
            <h3>📜 年兽故事</h3>
            <div class="story-text">${formatStoryText(story)}</div>
        </div>
    `;
}

// 格式化故事文本
function formatStoryText(text) {
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// 显示错误信息
function showStoryError(message) {
    const outputDiv = document.getElementById('storyOutput');
    outputDiv.innerHTML = `
        <div class="error-message">
            <p>❌ ${message}</p>
        </div>
    `;
}

// 保存故事到历史
function saveStoryToHistory(story, style, ageRange) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_HISTORY) || '[]');
    const newRecord = {
        id: Date.now(),
        content: story,
        style: style,
        ageRange: ageRange,
        createdAt: new Date().toISOString()
    };
    
    history.unshift(newRecord);
    
    // 最多保存50条
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem(STORAGE_KEYS.STORY_HISTORY, JSON.stringify(history));
}

// 成就相关函数
function loadAchievements() {
    const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return achievements ? JSON.parse(achievements) : {};
}

function saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

function unlockAchievement(achievementId) {
    const achievements = loadAchievements();
    
    if (!achievements[achievementId]) {
        achievements[achievementId] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
        };
        saveAchievements(achievements);
        
        // 如果成就模态框是打开的，重新渲染
        const achievementModal = document.getElementById('achievementModal');
        if (achievementModal.classList.contains('show')) {
            renderAchievementList();
        }
    }
}

function getStyleAchievementId(style) {
    const styleMap = {
        'traditional': 'traditional_style',
        'humorous': 'humorous_style',
        'adventure': 'adventure_style',
        'warm': 'warm_style',
        'mystery': 'mystery_style'
    };
    return styleMap[style] || null;
}

function getAgeAchievementId(ageRange) {
    const ageMap = {
        '3-6': 'child_friendly',
        '7-12': 'child_friendly',
        '13-18': 'teen_friendly',
        'adult': 'adult_friendly'
    };
    return ageMap[ageRange] || null;
}

function checkStoryCountAchievements() {
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.STORY_COUNT) || '0');
    
    if (count >= 5) {
        unlockAchievement('storyteller_5');
    }
    if (count >= 10) {
        unlockAchievement('storyteller_10');
    }
}

// 成就模态框
function initAchievementModal() {
    const achievementBtn = document.getElementById('achievementBtn');
    const closeAchievementModal = document.getElementById('closeAchievementModal');
    const achievementModal = document.getElementById('achievementModal');
    
    if (!achievementBtn || !closeAchievementModal || !achievementModal) return;
    
    achievementBtn.addEventListener('click', () => {
        renderAchievementList();
        achievementModal.classList.add('show');
    });
    
    closeAchievementModal.addEventListener('click', () => {
        achievementModal.classList.remove('show');
    });
    
    achievementModal.addEventListener('click', (e) => {
        if (e.target === achievementModal) {
            achievementModal.classList.remove('show');
        }
    });
}

function renderAchievementList() {
    const achievements = loadAchievements();
    const achievementList = document.getElementById('achievementList');
    const achievementCount = document.getElementById('achievementCount');
    
    const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
    achievementCount.textContent = unlockedCount;
    
    achievementList.innerHTML = '';
    
    Object.keys(ACHIEVEMENTS).forEach(achievementId => {
        const achievement = ACHIEVEMENTS[achievementId];
        const isUnlocked = achievements[achievementId]?.unlocked;
        
        const item = document.createElement('div');
        item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        item.innerHTML = `
            <div class="achievement-icon-display">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc-display">${achievement.desc}</div>
            </div>
            <div class="achievement-status">
                ${isUnlocked ? '✓ 已解锁' : '🔒 未解锁'}
            </div>
        `;
        
        achievementList.appendChild(item);
    });
}

// 历史模态框
function initHistoryModal() {
    const historyBtn = document.getElementById('historyBtn');
    const closeHistoryModal = document.getElementById('closeHistoryModal');
    const historyModal = document.getElementById('historyModal');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (!historyBtn || !closeHistoryModal || !historyModal) return;
    
    historyBtn.addEventListener('click', () => {
        renderHistoryList();
        historyModal.classList.add('show');
    });
    
    closeHistoryModal.addEventListener('click', () => {
        historyModal.classList.remove('show');
    });
    
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('show');
        }
    });
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('确定要清空所有历史记录吗？')) {
                localStorage.removeItem(STORAGE_KEYS.STORY_HISTORY);
                renderHistoryList();
            }
        });
    }
}

function renderHistoryList() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_HISTORY) || '[]');
    const historyList = document.getElementById('historyList');
    const storyCount = document.getElementById('storyCount');
    
    storyCount.textContent = history.length;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <p>📚 还没有生成过故事</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">开始创作你的第一个年兽故事吧！</p>
            </div>
        `;
        return;
    }
    
    const styleNames = {
        'traditional': '传统神话',
        'humorous': '幽默搞笑',
        'adventure': '冒险探险',
        'warm': '温馨治愈',
        'mystery': '悬疑解谜'
    };
    
    const ageNames = {
        '3-6': '3-6岁',
        '7-12': '7-12岁',
        '13-18': '13-18岁',
        'adult': '成人'
    };
    
    history.forEach((record) => {
        const date = new Date(record.createdAt);
        const dateStr = date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-header">
                <div class="history-meta">
                    <span>📅 ${dateStr}</span>
                    <span>🎨 ${styleNames[record.style] || record.style}</span>
                    <span>👥 ${ageNames[record.ageRange] || record.ageRange}</span>
                </div>
                <button class="btn btn-small" onclick="deleteHistoryItem(${record.id})" style="background: var(--error); color: white; padding: 5px 10px; font-size: 0.8rem;">删除</button>
            </div>
            <div class="history-content">
                <div class="history-text">${formatStoryText(record.content)}</div>
            </div>
        `;
        
        historyList.appendChild(item);
    });
}

function deleteHistoryItem(id) {
    if (confirm('确定要删除这条故事吗？')) {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_HISTORY) || '[]');
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.STORY_HISTORY, JSON.stringify(filtered));
        renderHistoryList();
    }
}

// 全局函数（用于HTML中的onclick）
window.deleteHistoryItem = deleteHistoryItem;