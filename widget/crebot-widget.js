/**
 * CreBot — Embeddable Chat Widget
 * Premium minimal design. Dependency-free. Self-contained.
 */
(function () {
    "use strict";

    const scriptTag = document.currentScript;
    const WIDGET_KEY = scriptTag?.getAttribute("data-widget-key") || "";
    const BOT_ID = scriptTag?.getAttribute("data-bot-id") || "";
    const API_URL = scriptTag?.getAttribute("data-api-url") || "https://crebot-ole4.onrender.com";

    if (!WIDGET_KEY && !BOT_ID) {
        console.error("[CreBot] Missing data-widget-key or data-bot-id.");
        return;
    }

    const CHAT_ENDPOINT = BOT_ID
        ? `${API_URL}/api/widget/by-bot/${BOT_ID}/chat`
        : `${API_URL}/api/widget/${WIDGET_KEY}/chat`;

    const chatHistory = [];
    const MAX_HISTORY = 20;

    // ── Styles ──────────────────────────────────────
    const STYLES = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        #crebot-widget-container *,
        #crebot-widget-container *::before,
        #crebot-widget-container *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        #crebot-widget-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* ── Floating Bubble ── */
        #crebot-bubble {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #ea580c;
            color: #fff;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #crebot-bubble:hover {
            transform: scale(1.06);
            box-shadow: 0 6px 20px rgba(234, 88, 12, 0.45);
        }
        #crebot-bubble svg { width: 24px; height: 24px; fill: currentColor; }

        /* ── Chat Panel ── */
        #crebot-panel {
            position: fixed;
            bottom: 92px;
            right: 24px;
            width: 370px;
            max-height: 580px;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
            display: none;
            flex-direction: column;
            z-index: 99998;
            overflow: hidden;
            transform-origin: bottom right;
        }
        #crebot-panel.open {
            display: flex;
            animation: crebot-open 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes crebot-open {
            from { opacity: 0; transform: scale(0.92) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Header ── */
        #crebot-header {
            padding: 18px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            background: #fff;
        }
        #crebot-header-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #crebot-header-title .crebot-header-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }
        #crebot-header-title span {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            letter-spacing: -0.01em;
        }
        #crebot-header-close {
            background: none;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #9ca3af;
            transition: all 0.15s;
        }
        #crebot-header-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        #crebot-header-close svg { width: 16px; height: 16px; }

        /* ── Messages Area ── */
        #crebot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            max-height: 380px;
            background: #fff;
            scroll-behavior: smooth;
        }
        #crebot-messages::-webkit-scrollbar { width: 4px; }
        #crebot-messages::-webkit-scrollbar-track { background: transparent; }
        #crebot-messages::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 4px;
        }

        /* ── Message Rows ── */
        .crebot-msg-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
        }
        .crebot-msg-row.user { flex-direction: row-reverse; }

        .crebot-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }
        .crebot-avatar.bot-avatar {
            background: #fff7ed;
            color: #ea580c;
        }
        .crebot-avatar.bot-avatar svg {
            width: 14px;
            height: 14px;
        }
        .crebot-avatar.user-avatar {
            background: #ea580c;
            color: #fff;
        }

        .crebot-msg-body {
            display: flex;
            flex-direction: column;
            max-width: calc(100% - 40px);
        }
        .crebot-msg-row.user .crebot-msg-body { align-items: flex-end; }

        .crebot-msg-bubble {
            padding: 10px 14px;
            font-size: 13.5px;
            line-height: 1.6;
            word-break: break-word;
            white-space: pre-wrap;
            border: none;
            outline: none;
        }
        .crebot-msg-row.user .crebot-msg-bubble {
            background: #ffffff;
            color: #ea580c;
            border-radius: 16px 16px 4px 16px;
        }
        .crebot-msg-row.bot .crebot-msg-bubble {
            background: transparent;
            color: #1f2937;
            border-radius: 16px 16px 16px 4px;
            padding: 6px 2px;
        }
        .crebot-msg-row.bot.loading .crebot-msg-bubble { color: #9ca3af; }

        /* ── Typing dots animation ── */
        .crebot-typing-dots {
            display: inline-flex;
            gap: 4px;
            padding: 4px 0;
        }
        .crebot-typing-dots span {
            width: 6px;
            height: 6px;
            background: #d1d5db;
            border-radius: 50%;
            animation: crebot-bounce 1.2s infinite ease-in-out;
        }
        .crebot-typing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .crebot-typing-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes crebot-bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
        }

        /* ── Copy Button ── */
        .crebot-msg-actions {
            display: flex;
            margin-top: 4px;
            padding-left: 2px;
        }
        .crebot-copy-btn {
            background: none;
            border: none;
            color: #d1d5db;
            cursor: pointer;
            padding: 3px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            transition: all 0.15s;
        }
        .crebot-copy-btn:hover { color: #6b7280; }
        .crebot-copy-btn svg { width: 13px; height: 13px; }

        /* ── Input Area ── */
        #crebot-input-area {
            display: flex;
            padding: 14px 16px;
            background: #fff;
            align-items: center;
            gap: 10px;
            border-top: 1px solid rgba(0,0,0,0.05);
        }
        #crebot-input {
            flex: 1;
            border: 1.5px solid #e5e7eb;
            background: #fafafa;
            border-radius: 12px;
            padding: 11px 14px;
            font-size: 13.5px;
            font-family: inherit;
            outline: none;
            transition: all 0.2s;
            color: #111827;
        }
        #crebot-input::placeholder { color: #9ca3af; }
        #crebot-input:focus {
            border-color: #ea580c;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.08);
        }
        #crebot-send {
            background: #ea580c;
            color: #fff;
            border: none;
            border-radius: 12px;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        #crebot-send svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
            margin-left: 1px;
        }
        #crebot-send:hover { background: #c2410c; }
        #crebot-send:disabled {
            background: #fdba74;
            cursor: not-allowed;
        }

        /* ── Footer ── */
        #crebot-footer {
            text-align: center;
            padding: 6px 0 14px;
            background: #fff;
            font-size: 10.5px;
            color: #c0c5cc;
            letter-spacing: 0.02em;
        }
        #crebot-footer strong {
            color: #9ca3af;
            font-weight: 600;
        }

        /* ── Code blocks ── */
        .crebot-msg-bubble pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 10px 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
            font-size: 12px;
            line-height: 1.5;
        }
        .crebot-msg-bubble code {
            font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', Consolas, monospace;
            background: rgba(0,0,0,0.04);
            padding: 1.5px 5px;
            border-radius: 4px;
            font-size: 12.5px;
        }
        .crebot-msg-row.user .crebot-msg-bubble code {
            background: rgba(255,255,255,0.18);
        }

        /* ── Mobile ── */
        @media (max-width: 440px) {
            #crebot-panel {
                width: calc(100vw - 24px);
                right: 12px;
                bottom: 84px;
                max-height: 80vh;
                border-radius: 16px;
            }
        }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // ── DOM ──────────────────────────────────────
    const container = document.createElement("div");
    container.id = "crebot-widget-container";
    container.innerHTML = `
        <button id="crebot-bubble" aria-label="Open chat">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        </button>
        <div id="crebot-panel">
            <div id="crebot-header">
                <div id="crebot-header-title">
                    <div class="crebot-header-dot"></div>
                    <span>Chat Support</span>
                </div>
                <button id="crebot-header-close" aria-label="Close chat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div id="crebot-messages"></div>
            <div id="crebot-input-area">
                <input id="crebot-input" type="text" placeholder="Ask anything..." autocomplete="off" />
                <button id="crebot-send" aria-label="Send">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
            <div id="crebot-footer">Powered by <strong>CreBot</strong></div>
        </div>
    `;
    document.body.appendChild(container);

    const bubble = document.getElementById("crebot-bubble");
    const panel = document.getElementById("crebot-panel");
    const closeBtn = document.getElementById("crebot-header-close");
    const messagesDiv = document.getElementById("crebot-messages");
    const inputEl = document.getElementById("crebot-input");
    const sendBtn = document.getElementById("crebot-send");

    bubble.addEventListener("click", () => {
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) inputEl.focus();
    });
    closeBtn.addEventListener("click", () => panel.classList.remove("open"));

    // ── Chat ──────────────────────────────────────
    function addMessage(text, sender, isInitial = false) {
        const row = document.createElement("div");
        row.className = `crebot-msg-row ${sender}`;
        const isBot = sender.includes("bot");
        const isLoading = sender.includes("loading");

        // Avatar
        const avatar = document.createElement("div");
        avatar.className = `crebot-avatar ${isBot ? 'bot-avatar' : 'user-avatar'}`;
        if (isBot) {
            avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M9 13v2"/><path d="M15 13v2"/></svg>`;
        } else {
            avatar.textContent = "U";
        }
        row.appendChild(avatar);

        // Body
        const body = document.createElement("div");
        body.className = "crebot-msg-body";

        const bubbleEl = document.createElement("div");
        bubbleEl.className = "crebot-msg-bubble";

        if (isLoading) {
            bubbleEl.innerHTML = '<div class="crebot-typing-dots"><span></span><span></span><span></span></div>';
        } else {
            bubbleEl.textContent = text;
        }
        body.appendChild(bubbleEl);

        // Copy button (bot messages only, not initial greeting, not loading)
        if (isBot && !isInitial) {
            const actionsDiv = document.createElement("div");
            actionsDiv.className = "crebot-msg-actions";
            actionsDiv.innerHTML = `
                <button class="crebot-copy-btn" title="Copy" aria-label="Copy message">
                    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
            `;
            if (isLoading) actionsDiv.style.display = "none";
            body.appendChild(actionsDiv);

            const copyBtn = actionsDiv.querySelector('.crebot-copy-btn');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(bubbleEl.textContent);
                const orig = copyBtn.innerHTML;
                copyBtn.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" stroke="#22c55e" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                copyBtn.style.color = "#22c55e";
                setTimeout(() => { copyBtn.innerHTML = orig; copyBtn.style.color = ""; }, 1500);
            });
        }

        row.appendChild(body);
        messagesDiv.appendChild(row);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return { msg: row, contentDiv: bubbleEl, actionsDiv: body.querySelector('.crebot-msg-actions') };
    }

    addMessage("Hi! How can I help you today?", "bot", true);

    async function sendMessage() {
        const question = inputEl.value.trim();
        if (!question) return;

        addMessage(question, "user");
        inputEl.value = "";
        sendBtn.disabled = true;
        chatHistory.push({ role: "user", content: question });

        const { msg: loadingRow, contentDiv: loadingBubble, actionsDiv } = addMessage("", "bot loading");

        try {
            const res = await fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, chat_history: chatHistory.slice(-MAX_HISTORY) }),
            });
            const data = await res.json();
            const answerText = data.answer || "Sorry, something went wrong.";

            loadingBubble.textContent = answerText;
            loadingRow.classList.remove("loading");
            if (actionsDiv) actionsDiv.style.display = "flex";
            chatHistory.push({ role: "assistant", content: answerText });
            while (chatHistory.length > MAX_HISTORY) chatHistory.shift();
        } catch (err) {
            loadingBubble.textContent = "Something went wrong. Please try again.";
            loadingRow.classList.remove("loading");
            console.error("[CreBot]", err);
        }

        sendBtn.disabled = false;
        inputEl.focus();
    }

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
})();
