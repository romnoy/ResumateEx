// js/chat.js

// משתנים לאלמנטים במסך
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');

// המאגר של השאלות
const questions = [
    { key: 'userName', text: 'היי! שמי רזומי 👋\n\nמה שמך?' },
    { key: 'workExperience', text: 'נעים מאוד להכיר! 😊\n\nבואי נתחיל: ספרי לי על הניסיון התעסוקתי שלך. איזה תפקידים היו לך? באילו חברות? מתי?' },
    { key: 'skills', text: 'מעולה! תודה על המידע 👍\n\nעכשיו, ספרי לי על הכישורים שלך:\n• כישורים טכניים (תוכנות, כלים, טכנולוגיות)\n• כישורים רכים (עבודת צוות, ניהול זמן, תקשורת וכו\')' },
    { key: 'education', text: 'נהדר! כמעט סיימנו 🎯\n\nשאלה אחרונה: ספרי לי על ההשכלה שלך. תארים, קורסים, הכשרות - כל מה שרלוונטי!' }
];

let currentQuestionIndex = 0;
let chatHistory = []; // לשמירת ההיסטוריה לשרת

document.addEventListener('DOMContentLoaded', function () {

    // 1. הסרת הודעת הפתיחה ("ברוכים הבאים") מיד בהתחלה
    const welcomeBox = document.querySelector('.welcome-box');
    if (welcomeBox) {
        welcomeBox.remove();
    }

    // הפעלת השדות
    if (chatInput) {
        chatInput.disabled = false;
        sendButton.disabled = false;

        // האזנה לאירועים
        sendButton.addEventListener('click', handleUserResponse);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleUserResponse();
        });
    }

    // התחלת השיחה עם השהיה קטנה
    setTimeout(() => {
        askQuestion(0);
    }, 500);
});

// פונקציה להצגת שאלת הבוט עם אפקט "חשיבה"
function askQuestion(index) {
    const questionObj = questions[index];

    // הצגת סימון הקלדה (...)
    showTyping(true);

    // השהיה של שנייה וחצי כדי שזה ייראה טבעי
    setTimeout(() => {
        // הסתרת הסימון והצגת השאלה
        showTyping(false);
        addMessageToUI(questionObj.text, 'bot');

        // שמירה בהיסטוריה
        chatHistory.push({role: 'assistant', content: questionObj.text});

        // גלילה למטה ומיקוד לשדה הטקסט
        scrollToBottom();
        if(chatInput) chatInput.focus();

    }, 1500);
}

async function handleUserResponse() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    // 1. הצגת הודעת המשתמש מיד
    addMessageToUI(userText, 'user');
    chatInput.value = '';
    chatHistory.push({role: 'user', content: userText});

    // נעילת שדה הקלט זמנית
    chatInput.disabled = true;
    sendButton.disabled = true;

    // --- שינוי: במקום לפנות לשרת, אנחנו פשוט מחכים קצת ב-JS וממשיכים ---

    // אופציונלי: השהיה קטנה לתחושה טבעית לפני שהבוט "מתחיל להקליד" את השאלה הבאה
    // אם את לא רוצה השהיה בכלל, אפשר למחוק את ה-setTimeout
    setTimeout(() => {

        // שחרור הנעילה
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.focus();

        // 2. מעבר לשאלה הבאה
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            // אם יש עוד שאלות - הצג את הבאה (הפונקציה askQuestion תטפל באנימציית ההקלדה)
            askQuestion(currentQuestionIndex);
        } else {
            // אם נגמרו השאלות - סיום אוטומטי
            finishChatAuto();
        }

    }, 500); // חצי שנייה "מנוחה" בין שליחת ההודעה לתחילת התגובה
}


// פונקציית סיום אוטומטית (בלי כפתור!)
function finishChatAuto() {
    showTyping(true);

    // השהיה קצרה ואז הודעת סיום
    setTimeout(() => {
        showTyping(false);
        const goodbyeMessage = "תודה רבה! אספתי את כל הפרטים. אני מכינה עבורך את קורות החיים... ⏳";
        addMessageToUI(goodbyeMessage, 'bot');
        chatHistory.push({role: 'assistant', content: goodbyeMessage});

        // קריאה לפונקציית השמירה והמעבר
        saveAndRedirect();

    }, 1500);
}

async function saveAndRedirect() {
    // השהיה נוספת קטנה לפני המעבר כדי שהמשתמש יספיק לקרוא
    setTimeout(async () => {
        try {
            const response = await fetch('/api/Resumate/SaveChat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({chatHistory: chatHistory})
            });

            if (response.ok) {
                // מעבר דף אוטומטי!
                window.location.href = 'resume-preview.html';
            } else {
                // במקרה חירום (דמו) נעבור בכל מקרה
                console.warn('Server save failed, redirecting anyway for demo');
                window.location.href = 'resume-preview.html';
            }
        } catch (error) {
            console.error('Error saving chat:', error);
            // מעבר בכל מקרה בדמו
            window.location.href = 'resume-preview.html';
        }
    }, 2000); // 2 שניות המתנה לפני המעבר
}

// --- פונקציות עזר לתצוגה ---

function addMessageToUI(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    // שימור ירידות שורה
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<div class="message-bubble">${formattedText}</div>`;

    // הוספה לפני האינדיקטור (כדי שהוא תמיד יהיה למטה)
    chatMessages.insertBefore(messageDiv, typingIndicator.parentElement);
    scrollToBottom();
}

function showTyping(show) {
    if (show) {
        typingIndicator.classList.add('show');
        typingIndicator.parentElement.style.display = 'flex'; // מראה את הבועה של הבוט שמכילה את הנקודות
    } else {
        typingIndicator.classList.remove('show');
        typingIndicator.parentElement.style.display = 'none';
    }
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}