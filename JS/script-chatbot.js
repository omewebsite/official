(function () {
  // --- 1. HTML Injection ---
  const chatbotHTML = `
    <div class="chat-widget">
      <div id="chatPopup" class="chat-popup">
        <div class="chat-header">
          <span class="title">OME Chatbot</span>
          <button id="closeChatBtn" class="close-btn" aria-label="Close chat">✖</button>
        </div>
        <div id="chatMessages" class="chat-messages">
        </div>
        <div id="typingIndicator" class="typing-indicator" style="display: none;">OME Chatbot กำลังพิมพ์...</div>
        <div class="chat-input-area">
          <input type="text" id="userInput" placeholder="พิมพ์คำถามของคุณที่นี่..." aria-label="Chat input">
          <button id="sendMessageBtn" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      <button id="chatButton" class="chat-button" aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>
  `;

  if (!document.querySelector('.chat-widget')) {
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  // --- 2. Configuration & State ---
  const chatButton = document.getElementById('chatButton');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatPopup = document.getElementById('chatPopup');
  const chatMessages = document.getElementById('chatMessages');
  const userInput = document.getElementById('userInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const typingIndicator = document.getElementById('typingIndicator');

  const API_KEY = "";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // List of files to crawl from "ข้อมูลองค์กร"
  const DATA_SOURCES = [
    'content-ceo-en.md', 'content-ceo-th.md',
    'content-duty-en.md', 'content-duty-th.md',
    'content-story-en.md', 'content-story-th.md',
    'content-unit-en.md', 'content-unit-th.md'
  ];

  let chatHistory = [];
  let isFirstMessageSent = false;
  let OME_CONTEXT = "";

  // --- 3. Data Loading ---
  async function loadAllContexts() {
    try {
      const fetchPromises = DATA_SOURCES.map(file =>
        fetch(`./ข้อมูลองค์กร/${file}`).then(res => res.ok ? res.text() : `[Missing: ${file}]`)
      );
      const contents = await Promise.all(fetchPromises);
      OME_CONTEXT = contents.join('\n\n---\n\n');
      console.log("All context files loaded.");
    } catch (err) {
      console.error("Context loading error:", err);
      OME_CONTEXT = "ข้อมูลเบื้องต้นเกี่ยวกับ สศท.สปท. (สำนักการศึกษาทหาร)";
    }
  }

  // --- 4. Chat Helpers ---
  function getSystemInstructions() {
    return {
      parts: [{
        text: `You are 'OME Chatbot', the official assistant for the Office of Military Education (OME), Royal Thai Armed Forces.
Respond politely in the language of the user.
Use ONLY the following context to answer questions. If the information is not here, state that you don't have that information.

CONTEXT FROM ORGANIZATION DATA:
${OME_CONTEXT}`
      }]
    };
  }

  function displayMessage(htmlContent, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = htmlContent;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function textToHtmlWithLinks(text) {
    let html = escapeHtml(text).replace(/\n/g, '<br>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return html;
  }

  const toggleChat = () => {
    const isHidden = chatPopup.style.display === 'none' || chatPopup.style.display === '';
    chatPopup.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
      if (!isFirstMessageSent) sendInitialGreeting();
      userInput.focus();
    }
  };

  // --- 5. API Functions ---
  async function sendInitialGreeting() {
    if (isFirstMessageSent) return;
    isFirstMessageSent = true;
    typingIndicator.style.display = 'block';

    const initialPrompt = { role: "user", parts: [{ text: "Please introduce yourself in Thai and offer assistance." }] };
    const body = {
      contents: [initialPrompt],
      system_instruction: getSystemInstructions(),
      generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
    };

    try {
      const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      typingIndicator.style.display = 'none';
      if (!res.ok) throw new Error("API Connection Failed");

      const data = await res.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "สวัสดีครับ OME Chatbot ยินดีให้บริการครับ";
      displayMessage(textToHtmlWithLinks(botText), 'bot');
      chatHistory.push({ role: "model", parts: [{ text: botText }] });
    } catch (err) {
      typingIndicator.style.display = 'none';
      displayMessage(textToHtmlWithLinks("สวัสดีครับ OME Chatbot ยินดีให้บริการ มีอะไรให้ช่วยสอบถามได้เลยครับ"), 'bot');
    }
  }

  async function handleSendMessage() {
    const messageText = userInput.value.trim();
    if (!messageText) return;

    displayMessage(textToHtmlWithLinks(messageText), 'user');
    chatHistory.push({ role: "user", parts: [{ text: messageText }] });
    userInput.value = "";
    typingIndicator.style.display = 'block';

    const body = {
      contents: chatHistory,
      system_instruction: getSystemInstructions(),
      generationConfig: { temperature: 0.7, maxOutputTokens: 2000 }
    };

    try {
      const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      typingIndicator.style.display = 'none';
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัยครับ ไม่สามารถตอบคำถามได้ในขณะนี้";
      displayMessage(textToHtmlWithLinks(botText), 'bot');
      chatHistory.push({ role: "model", parts: [{ text: botText }] });
    } catch (err) {
      typingIndicator.style.display = 'none';
      displayMessage(textToHtmlWithLinks("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง"), 'bot');
    }
  }

  // --- 6. Event Listeners ---
  chatButton.addEventListener('click', async () => {
    if (!OME_CONTEXT) await loadAllContexts();
    toggleChat();
  });

  closeChatBtn.addEventListener('click', toggleChat);
  sendMessageBtn.addEventListener('click', handleSendMessage);
  userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } });

})();
