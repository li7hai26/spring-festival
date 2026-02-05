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
            
            try {
                // 先显示结果区域和标题
                const resultSection = document.getElementById('customsResult');
                const titleEl = document.getElementById('customsTitle');
                const contentEl = document.getElementById('customsContent');
                
                titleEl.textContent = provinceName;
                resultSection.style.display = 'block';
                contentEl.innerHTML = '<p class="loading-text">AI 正在为您撰写...</p>';
                
                // 滚动到结果区域
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // 流式查询并实时更新
                const fullContent = await queryCustomsWithAI(provinceName, (content) => {
                    displayStreamingContent(content);
                });
                
                // 查询完成后解析并格式化显示
                const customs = parseCustomsContent(fullContent);
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

// 使用 AI 查询习俗（流式响应）
async function queryCustomsWithAI(provinceName, onUpdate) {
    const apiUrl = localStorage.getItem('nianshou_api_url');
    const apiKey = localStorage.getItem('nianshou_api_key');
    const modelName = localStorage.getItem('nianshou_model_name');
    
    if (!apiUrl || !apiKey) {
        throw new Error('请先在首页配置 API Key');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 增加超时时间到 90 秒
    
    let fullContent = '';
    
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
                temperature: 0.7,
                stream: true
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 解码并添加到缓冲区
            buffer += decoder.decode(value, { stream: true });
            
            // 按行分割
            const lines = buffer.split('\n');
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || '';
            
            // 处理每个完整的行
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('data:')) {
                    const data = trimmedLine.slice(5);  // 移除 "data:" 前缀（5个字符）
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content;
                        if (content) {
                            fullContent += content;
                            if (onUpdate) {
                                onUpdate(fullContent);
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误，继续处理下一行
                    }
                }
            }
        }
        
        // 处理缓冲区中剩余的内容
        if (buffer.trim()) {
            const trimmedLine = buffer.trim();
            if (trimmedLine.startsWith('data:')) {
                const data = trimmedLine.slice(5);
                if (data !== '[DONE]') {
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content;
                        if (content) {
                            fullContent += content;
                            if (onUpdate) {
                                onUpdate(fullContent);
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
        
        console.log('流式响应完成，总内容长度:', fullContent.length);
        console.log('完整内容:', fullContent);
        
        // 返回完整内容
        return fullContent;
        
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
    
    // 先清理内容，移除多余的空行
    const cleanedContent = content.trim().replace(/\n{3,}/g, '\n\n');
    
    // 按三级标题分割（支持 ### 或 ##）
    const sections = cleanedContent.split(/#{2,3}\s+/).filter(s => s.trim());
    
    // 如果没有找到标题，尝试按数字序号分割（如 "1."、"2."）
    if (sections.length === 0) {
        const numberedSections = cleanedContent.split(/\n\d+\.\s+/).filter(s => s.trim());
        if (numberedSections.length > 0) {
            // 提取数字序号作为标题
            const numberMatches = cleanedContent.match(/\n(\d+)\.\s+/g);
            numberedSections.forEach((section, index) => {
                const lines = section.trim().split('\n');
                if (lines.length === 0) return;
                
                const title = numberMatches?.[index]?.trim() || `习俗 ${index + 1}`;
                const description = section.trim();
                
                if (title && description) {
                    customs.push({
                        title: title.replace(/^\d+\.\s*/, ''),
                        desc: description
                    });
                }
            });
        }
    } else {
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
    }
    
    // 如果还是解析不出来，就把整个内容作为一个习俗
    if (customs.length === 0 && cleanedContent.length > 0) {
        customs.push({
            title: '春节习俗',
            desc: cleanedContent
        });
    }
    
    console.log('解析结果：', customs);
    console.log('原始内容：', cleanedContent);
    
    return customs;
}

// 显示流式内容（实时更新）
function displayStreamingContent(content) {
    const contentEl = document.getElementById('customsContent');
    
    // 简单的 Markdown 转换
    let html = content
        .replace(/###\s*(.+?)(?:\n|$)/g, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    contentEl.innerHTML = html;
    
    // 自动滚动到底部
    contentEl.scrollTop = contentEl.scrollHeight;
}

// 显示习俗（格式化后）
function displayCustoms(provinceName, customs) {
    const resultSection = document.getElementById('customsResult');
    const titleEl = document.getElementById('customsTitle');
    const contentEl = document.getElementById('customsContent');
    
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
    
    // 显示结果区域
    resultSection.style.display = 'block';
}