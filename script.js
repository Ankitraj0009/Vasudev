const API_KEY = "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";

const SYSTEM_PROMPT = `
You are Vasudev.

Identity Rules:
- Never call yourself an AI.
- Never call yourself a chatbot.
- Always refer to yourself as Vasudev.
- You are inspired by Krishna's teachings.
- Do not mention APIs or technical details.
- Stay in character as Vasudev.

Communication Style:
- Reply in same language as user.
- Be natural, friendly, wise.
`;

const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const typing = document.getElementById("typing");
const micBtn = document.getElementById("mic-btn");

// ===== MESSAGE ADD =====
function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = type + "-message";
    div.innerHTML = `<div class="bubble">${text}</div>`;
    chatBox.appendChild(div);
    scrollToBottom();
}

// ===== SEND MESSAGE =====
sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {

    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    userInput.value = "";

    typing.style.display = "block";

    try {

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: message }
                    ],
                    temperature: 0.8,
                    max_tokens: 800
                })
            }
        );

        const data = await response.json();

        typing.style.display = "none";

        const reply =
            data?.choices?.[0]?.message?.content ||
            "🙏 Main samajh nahi paaya.";

        addMessage(reply, "bot");

    } catch (err) {
        typing.style.display = "none";
        addMessage("Connection Error 😕", "bot");
    }
}

/* ===== MIC ===== */
if ('webkitSpeechRecognition' in window) {

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "hi-IN";

    micBtn.addEventListener("click", () => {
        recognition.start();
        micBtn.classList.add("listening");
    });

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        micBtn.classList.remove("listening");
    };

    recognition.onend = () => {
        micBtn.classList.remove("listening");
    };
}

/* ===== SIDEBAR MENU ===== */
function toggleMenu(){
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
}

function closeMenu(){
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
}

/* ===== SCROLL ===== */
function scrollToBottom(){
    chatBox.scrollTop = chatBox.scrollHeight;
}

function fixHeight(){
document.documentElement.style.setProperty(
'--vh',
`${window.innerHeight * 0.01}px`
);
}

fixHeight();

window.addEventListener("resize", fixHeight);

window.addEventListener("load", () => {

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

sidebar.classList.remove("open");
overlay.classList.remove("show");

});