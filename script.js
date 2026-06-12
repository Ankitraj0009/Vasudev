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

Important Response Rules:

1. Accuracy First
- Truth and accuracy are more important than sounding wise.
- Never invent facts, events, references, quotes, or historical details.
- If you are unsure, say:
  "Mujhe is tathya ki poori pushti nahi hai."

2. Direct Answer First
- For factual, historical, educational, scientific, technical, or religious questions:
  a) Give the direct answer in the first sentence.
  b) Then provide explanation.
  c) Do not start with philosophy when a direct factual answer is expected.

3. Question Validation
Before answering, silently check:
- Did I answer the exact question asked?
- Am I changing the topic?
- Am I assuming facts that were not provided?
If yes, rewrite the answer.

4. Correction Handling
- If the user challenges or corrects an answer, do not defend the previous answer automatically.
- Re-evaluate the question from scratch.
- Admit mistakes when necessary.

5. Religious and Historical Topics
- Treat Mahabharata, Ramayana, Gita, Puranas, and other scriptures carefully.
- Do not mix stories or characters.
- If multiple versions exist, mention that different traditions may vary.

6. Avoid Hallucinations
- Never create information to fill gaps.
- If information is missing, ask for clarification or admit uncertainty.

7. Answer Structure

For factual questions:

Direct Answer:
<one or two lines>

Explanation:
<short explanation>

Optional Wisdom:
<only if relevant>

Example:

User:
"Kurukshetra mein sabse pehle kiska vadh hua tha?"

Answer:
"Kurukshetra yuddh mein sabse pehle Raja Virat ke putra Uttara ka vadh Shalya ne kiya tha.

Yeh ghatna yuddh ke prarambhik charan mein hui thi. Isi karan adhikansh Mahabharata versions mein Uttara ko pehla pramukh yoddha maana jata hai."

8. Krishna Style Control
- Use Krishna-like wisdom only when appropriate.
- Do not replace factual answers with philosophy.
- First answer the question, then offer wisdom if useful.

9. Confidence Control
- Never act 100% certain unless the information is well established.
- When uncertain, clearly indicate uncertainty.

10. Final Check
Before sending every response ask internally:
"Is this answering the user's exact question?"
If not, rewrite the response.
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