// 习俗查询专用脚本

// 省份名称映射
const PROVINCE_NAMES = {
    beijing: '北京',
    shanghai: '上海',
    guangdong: '广东',
    sichuan: '四川',
    jiangsu: '江苏',
    zhejiang: '浙江',
    fujian: '福建',
    shandong: '山东',
    henan: '河南',
    hubei: '湖北',
    hunan: '湖南',
    shaanxi: '陕西',
    liaoning: '辽宁',
    jilin: '吉林',
    heilongjiang: '黑龙江',
    xinjiang: '新疆',
    tibet: '西藏',
    guangxi: '广西',
    yunnan: '云南',
    guizhou: '贵州'
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 查询习俗
    const queryBtn = document.getElementById('queryCustomsBtn');
    if (queryBtn) {
        queryBtn.addEventListener('click', async () => {
            const province = document.getElementById('provinceSelect').value;
            
            if (!province) {
                alert('请选择省份');
                return;
            }
            
            const provinceName = PROVINCE_NAMES[province];
            const overlay = document.getElementById('loadingOverlay');
            
            // 显示全屏遮罩
            if (overlay) {
                overlay.style.display = 'flex';
            }
            
            try {
                const customs = await queryCustomsWithAI(provinceName);
                displayCustoms(provinceName, customs);
            } catch (error) {
                const resultSection = document.getElementById('customsResult');
                const contentDiv = document.getElementById('customsContent');
                resultSection.style.display = 'block';
                contentDiv.innerHTML = `
                    <div class="error-message">
                        <p>❌ 查询失败: ${error.message}</p>
                    </div>
                `;
            } finally {
                // 隐藏全屏遮罩
                if (overlay) {
                    overlay.style.display = 'none';
                }
            }
        });
    }
    
    // 返回查询按钮
    const backBtn = document.getElementById('backToSearch');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('customsResult').style.display = 'none';
            document.querySelector('.customs-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// 使用 AI 查询习俗
async function queryCustomsWithAI(provinceName) {
    const apiUrl = localStorage.getItem('nianshou_api_url');
    const apiKey = localStorage.getItem('nianshou_api_key');
    const modelName = localStorage.getItem('nianshou_model_name');
    
    if (!apiUrl || !apiKey) {
        throw new Error('请先在首页配置 API Key');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
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
                        content: `你是一个春节文化研究专家。请为"${provinceName}"创作详细的春节习俗介绍。

重要规则：
1. 必须基于真实的传统文化知识，不得编造虚假信息
2. 介绍应包括至少 3-5 个独特的春节习俗或传统活动
3. 每个习俗要有详细的描述，包括历史背景、具体做法和寓意
4. 使用生动的语言，让读者能够感受到节日的氛围
5. 格式要求：每个习俗使用三级标题（###）作为开头，然后是详细描述
6. 只提供真实的、有据可查的习俗信息，不要编造不存在的内容
7. 如果某个习俗有相关的知名活动或景点，可以提及，但不要提供具体的网页链接（除非你非常确定链接准确有效）`
                    },
                    {
                        role: 'user',
                        content: `请详细介绍${provinceName}的春节习俗和传统活动`
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 解析习俗内容
        return parseCustomsContent(content);
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('请求超时，请检查网络连接后重试');
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error('网络连接失败，请检查 API URL 是否正确');
        } else {
            throw error;
        }
    }
}

// 解析习俗内容
function parseCustomsContent(content) {
    const customs = [];
    
    // 按三级标题分割
    const sections = content.split('###').filter(s => s.trim());
    
    sections.forEach(section => {
        const lines = section.trim().split('\n');
        if (lines.length === 0) return;
        
        // 第一行是标题
        const title = lines[0].trim();
        
        // 剩余内容是描述
        const description = lines.slice(1).join('\n').trim();
        
        if (title && description) {
            customs.push({
                title: title.replace(/#+\s*/, ''), // 移除可能的标题符号
                desc: description
            });
        }
    });
    
    return customs;
}

// 显示习俗
function displayCustoms(provinceName, customs) {
    const resultSection = document.getElementById('customsResult');
    const titleEl = document.getElementById('customsTitle');
    const contentEl = document.getElementById('customsContent');
    const overlay = document.getElementById('loadingOverlay');
    
    // 隐藏遮罩
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    titleEl.textContent = provinceName;
    
    if (customs.length === 0) {
        contentEl.innerHTML = `
            <div class="error-message">
                <p>未能获取${provinceName}的习俗信息，请稍后重试</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    customs.forEach(custom => {
        html += `
            <h3>${custom.title}</h3>
            <p>${custom.desc}</p>
        `;
    });
    
    contentEl.innerHTML = html;
    
    // 平滑滚动到结果区域
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}