/**
 * CreBot — Embeddable Chat Widget
 * 
 * Usage: Add this to any website:
 * <script
 *   src="YOUR_HOST/widget/crebot-widget.js"
 *   data-widget-key="wk_xxxxx"
 *   data-api-url="https://your-backend.onrender.com"
 *   async>
 * </script>
 *
 * Dependency-free. Works on any site. Self-contained styles.
 *
 * Enhanced with:
 * - Chat history for conversational follow-ups
 * - Sends full conversation context to backend
 */
(function () {
    "use strict";

    // ── Configuration ────────────────────────────────────────────────────
    const scriptTag = document.currentScript;
    const WIDGET_KEY = scriptTag?.getAttribute("data-widget-key") || "";
    const API_URL = scriptTag?.getAttribute("data-api-url") || "";

    if (!WIDGET_KEY || !API_URL) {
        console.error("[CreBot] Missing data-widget-key or data-api-url on script tag.");
        return;
    }

    const CHAT_ENDPOINT = `${API_URL}/api/widget/${WIDGET_KEY}/chat`;

    // ── Chat history (kept in memory for the session) ────────────────────
    const chatHistory = [];
    const MAX_HISTORY = 20; // Keep the last 20 messages (10 turns)

    // ── Styles (injected into head) ──────────────────────────────────────
    const STYLES = `
        #crebot-widget-container * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        #crebot-bubble {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        #crebot-bubble:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
        }

        #crebot-bubble svg {
            width: 28px;
            height: 28px;
            fill: currentColor;
        }

        #crebot-panel {
            position: fixed;
            bottom: 96px;
            right: 24px;
            width: 380px;
            max-height: 520px;
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            display: none;
            flex-direction: column;
            z-index: 99998;
            overflow: hidden;
            animation: crebot-slide-up 0.25s ease-out;
        }

        #crebot-panel.open {
            display: flex;
        }

        @keyframes crebot-slide-up {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        #crebot-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            padding: 16px 20px;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #crebot-header-close {
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.15s;
        }

        #crebot-header-close:hover {
            opacity: 1;
        }

        #crebot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 360px;
            background: #f9fafb;
        }

        .crebot-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .crebot-msg.user {
            align-self: flex-end;
            background: #6366f1;
            color: #fff;
            border-bottom-right-radius: 4px;
        }

        .crebot-msg.bot {
            align-self: flex-start;
            background: #fff;
            color: #1f2937;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
        }

        .crebot-msg.bot.loading {
            color: #9ca3af;
            font-style: italic;
        }

        #crebot-input-area {
            display: flex;
            border-top: 1px solid #e5e7eb;
            padding: 12px;
            background: #fff;
        }

        #crebot-input {
            flex: 1;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s;
        }

        #crebot-input:focus {
            border-color: #6366f1;
        }

        #crebot-send {
            margin-left: 8px;
            background: #6366f1;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.15s;
        }

        #crebot-send:hover {
            background: #4f46e5;
        }

        #crebot-send:disabled {
            background: #c7d2fe;
            cursor: not-allowed;
        }

        /* Mobile responsive */
        @media (max-width: 440px) {
            #crebot-panel {
                width: calc(100vw - 32px);
                right: 16px;
                bottom: 88px;
                max-height: 70vh;
            }
        }
    `;

    // ── Inject styles ────────────────────────────────────────────────────
    const styleEl = document.createElement("style");
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // ── Build DOM ────────────────────────────────────────────────────────
    const container = document.createElement("div");
    container.id = "crebot-widget-container";
    container.innerHTML = `
        <button id="crebot-bubble" aria-label="Open chat">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        </button>
        <div id="crebot-panel">
            <div id="crebot-header">
                <span>💬 Chat Support</span>
                <button id="crebot-header-close" aria-label="Close chat">&times;</button>
            </div>
            <div id="crebot-messages">
                <div class="crebot-msg bot">Hi! 👋 How can I help you today?</div>
            </div>
            <div id="crebot-input-area">
                <input id="crebot-input" type="text" placeholder="Type your question..." autocomplete="off" />
                <button id="crebot-send">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // ── Element references ───────────────────────────────────────────────
    const bubble = document.getElementById("crebot-bubble");
    const panel = document.getElementById("crebot-panel");
    const closeBtn = document.getElementById("crebot-header-close");
    const messagesDiv = document.getElementById("crebot-messages");
    const inputEl = document.getElementById("crebot-input");
    const sendBtn = document.getElementById("crebot-send");

    // ── Toggle panel ─────────────────────────────────────────────────────
    bubble.addEventListener("click", () => {
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) {
            inputEl.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        panel.classList.remove("open");
    });

    // ── Chat logic ───────────────────────────────────────────────────────
    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = `crebot-msg ${sender}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return msg;
    }

    async function sendMessage() {
        const question = inputEl.value.trim();
        if (!question) return;

        // Show user message
        addMessage(question, "user");
        inputEl.value = "";
        sendBtn.disabled = true;

        // Add to chat history
        chatHistory.push({ role: "user", content: question });

        // Show loading indicator
        const loadingMsg = addMessage("Thinking...", "bot loading");

        try {
            const res = await fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    chat_history: chatHistory.slice(-MAX_HISTORY),
                }),
            });

            const data = await res.json();
            const answerText = data.answer || "Sorry, something went wrong.";

            // Replace loading message with actual answer
            loadingMsg.textContent = answerText;
            loadingMsg.classList.remove("loading");

            // Add bot response to chat history
            chatHistory.push({ role: "assistant", content: answerText });

            // Trim history if it gets too long
            while (chatHistory.length > MAX_HISTORY) {
                chatHistory.shift();
            }

        } catch (err) {
            loadingMsg.textContent = "I'm temporarily unavailable. Please try again in a moment.";
            loadingMsg.classList.remove("loading");
            console.error("[CreBot]", err);
        }

        sendBtn.disabled = false;
        inputEl.focus();
    }

    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
})();
