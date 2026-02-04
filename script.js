// 配置存储键名
const STORAGE_KEYS = {
    API_URL: 'nianshou_api_url',
    API_KEY: 'nianshou_api_key',
    MODEL_NAME: 'nianshou_model_name',
    STORY_COUNT: 'nianshou_story_count',
    ACHIEVEMENTS: 'nianshou_achievements'
};

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

// 页面加载时恢复配置
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initModal();
    initCharCounter();
    loadAchievements();
});

// 初始化字符计数器
function initCharCounter() {
    const textarea = document.getElementById('storyPrompt');
    const charCount = document.getElementById('charCount');
    const maxLength = 500;
    
    // 更新字符计数
    const updateCount = () => {
        const currentLength = textarea.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength >= maxLength) {
            charCount.style.color = 'var(--error)';
        } else {
            charCount.style.color = 'var(--primary-red)';
        }
    };
    
    // 监听输入事件
    textarea.addEventListener('input', updateCount);
    
    // 初始化计数
    updateCount();
}

// 初始化模态框
function initModal() {
    const configBtn = document.getElementById('configBtn');
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('configModal');
    
    // 打开配置模态框
    configBtn.addEventListener('click', () => {
        modal.classList.add('show');
        loadConfig();
    });
    
    // 关闭配置模态框
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // ESC 键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
}

// 加载保存的配置
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
    
    // 2秒后自动关闭模态框
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
document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('storyPrompt').value.trim();
    const style = document.getElementById('storyStyle').value;
    const ageRange = document.getElementById('ageRange').value;
    const apiUrl = localStorage.getItem(STORAGE_KEYS.API_URL);
    const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    const modelName = localStorage.getItem(STORAGE_KEYS.MODEL_NAME);
    
    if (!apiUrl || !apiKey) {
        showStoryError('请先点击上方"⚙️ 配置 API"按钮进行配置');
        return;
    }
    
    if (!prompt) {
        showStoryError('请输入故事提示词');
        return;
    }
    
    // 根据风格和年龄范围生成系统提示词
    const styleDescriptions = {
        'traditional': '传统神话风格，语言古朴典雅，充满神秘色彩，适合讲述古老的年兽传说',
        'humorous': '幽默搞笑风格，语言轻松诙谐，充满笑点，让读者在欢乐中了解年兽文化',
        'adventure': '冒险探险风格，情节紧张刺激，充满挑战和惊喜，讲述年兽的冒险经历',
        'warm': '温馨治愈风格，情感细腻温暖，充满正能量，传递爱与希望的主题',
        'mystery': '悬疑解谜风格，情节跌宕起伏，充满神秘感和推理元素，引人入胜'
    };
    
    const ageDescriptions = {
        '3-6': '适合3-6岁幼儿，语言简单易懂，句子短小，多用拟声词和叠词，情节简单有趣',
        '7-12': '适合7-12岁儿童，语言生动活泼，富有想象力，情节有趣且具有教育意义',
        '13-18': '适合13-18岁青少年，语言较为成熟，情节有深度，可以探讨成长、勇气等主题',
        'adult': '适合成人，语言成熟精炼，情节复杂有内涵，可以探讨人性、文化传承等深层主题'
    };
    
    const systemPrompt = `你是一个专门创作年兽故事的作家。严格规则：
1. 只能创作关于年兽的故事，年兽必须是故事的核心角色
2. 故事背景必须设定在春节时期或与春节习俗相关
3. 不得偏离年兽主题，不能写成其他动物或角色的故事
4. 风格：${styleDescriptions[style]}
5. 目标读者：${ageDescriptions[ageRange]}
6. 如果用户提示词与年兽无关，请拒绝并说明"我只能创作年兽相关的春节故事"`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
        showLoading(true);
        
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
                        content: systemPrompt
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

// 加载成就数据
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || '{}');
    return achievements;
}

// 保存成就数据
function saveAchievements(achievements) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

// 解锁成就
function unlockAchievement(achievementId) {
    const achievements = loadAchievements();
    
    if (!achievements[achievementId]) {
        achievements[achievementId] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
        };
        saveAchievements(achievements);
        
        const achievement = ACHIEVEMENTS[achievementId];
        showAchievementToast(achievement);
    }
}

// 显示成就弹出提示
function showAchievementToast(achievement) {
    const toast = document.getElementById('achievementToast');
    const desc = document.getElementById('achievementDesc');
    
    desc.textContent = achievement.name + ' - ' + achievement.desc;
    toast.classList.remove('hide');
    
    setTimeout(() => {
        toast.classList.add('hide');
    }, 4000);
}

// 获取风格对应的成就ID
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

// 获取年龄范围对应的成就ID
function getAgeAchievementId(ageRange) {
    const ageMap = {
        '3-6': 'child_friendly',
        '7-12': 'child_friendly',
        '13-18': 'teen_friendly',
        'adult': 'adult_friendly'
    };
    return ageMap[ageRange] || null;
}

// 检查并解锁故事数量成就
function checkStoryCountAchievements() {
    const count = parseInt(localStorage.getItem(STORAGE_KEYS.STORY_COUNT) || '0');
    
    if (count >= 5) {
        unlockAchievement('storyteller_5');
    }
    if (count >= 10) {
        unlockAchievement('storyteller_10');
    }
}