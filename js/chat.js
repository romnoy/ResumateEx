/**
 * Resumate Chat Module
 * ניהול צ'אטבוט איסוף מידע
 */

const ResumateChat = {
    // משתנים פנימיים
    currentQuestion: 0,
    answers: {
        userName: '',
        workExperience: '',
        skills: '',
        education: ''
    },

    // אלמנטים מה-DOM
    elements: {
        chatMessages: null,
        chatInput: null,
        sendButton: null,
        typingIndicator: null
    },

    /**
     * אתחול הצ'אט
     */
    init() {
        // קבלת אלמנטים
        this.elements.chatMessages = document.getElementById('chatMessages');
        this.elements.chatInput = document.getElementById('chatInput');
        this.elements.sendButton = document.getElementById('sendButton');
        this.elements.typingIndicator = document.getElementById('typingIndicator');

        // הגדרת מאזינים
        this.setupEventListeners();

        // טעינת נתוני משרה שנשמרו
        this.loadJobData();

        // הפעלת הצ'אט
        this.enableChat();

        // התחלת השיחה
        setTimeout(() => {
            this.askQuestion();
        }, 500);
    },

    /**
     * הגדרת מאזיני אירועים
     */
    setupEventListeners() {
        // Enter key
        this.elements.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.elements.chatInput.disabled) {
                this.sendMessage();
            }
        });

        // כפתור שליחה
        this.elements.sendButton.addEventListener('click', () => {
            if (!this.elements.sendButton.disabled) {
                this.sendMessage();
            }
        });
    },

    /**
     * טעינת נתוני משרה מ-localStorage
     */
    loadJobData() {
        const jobData = ResumateStorage.getJobData();
        
        if (jobData.jobField || jobData.jobDescription) {
            console.log('Loaded job data:', jobData);
        }
    },

    /**
     * הפעלת שדות הצ'אט
     */
    enableChat() {
        this.elements.chatInput.disabled = false;
        this.elements.sendButton.disabled = false;
        
        // הסרת welcome box אם קיים
        const welcomeBox = document.querySelector('.welcome-box');
        if (welcomeBox) {
            welcomeBox.remove();
        }
    },

    /**
     * הוספת הודעה לצ'אט
     */
    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.style.whiteSpace = 'pre-line';
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        
        // הוספה לפני אינדיקטור ההקלדה
        const typingParent = this.elements.typingIndicator.parentElement;
        this.elements.chatMessages.insertBefore(messageDiv, typingParent);
        
        // גלילה למטה
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    },

    /**
     * הצגת אינדיקטור הקלדה
     */
    showTyping() {
        this.elements.typingIndicator.classList.add('show');
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    },

    /**
     * הסתרת אינדיקטור הקלדה
     */
    hideTyping() {
        this.elements.typingIndicator.classList.remove('show');
    },

    /**
     * שאילת השאלה הנוכחית
     */
    askQuestion() {
        const questions = ResumateConfig.CHAT_QUESTIONS;
        
        if (this.currentQuestion >= questions.length) {
            // כל השאלות נענו - שמירה ומעבר לדף הבא
            this.saveAnswersAndRedirect();
            return;
        }

        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(questions[this.currentQuestion].text);
        }, 1000);
    },

    /**
     * שליחת הודעה
     */
    sendMessage() {
        const message = this.elements.chatInput.value.trim();
        if (!message) return;

        // הוספת הודעת המשתמש
        this.addMessage(message, true);
        this.elements.chatInput.value = '';

        // שמירת התשובה
        const questions = ResumateConfig.CHAT_QUESTIONS;
        const questionKey = questions[this.currentQuestion].key;
        this.answers[questionKey] = message;

        // מעבר לשאלה הבאה
        this.currentQuestion++;
        
        // שאילת השאלה הבאה לאחר השהייה
        setTimeout(() => {
            this.askQuestion();
        }, 800);
    },

    /**
     * שמירת כל התשובות ומעבר לדף הבא
     */
    saveAnswersAndRedirect() {
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage('מעולה! אני מכינה עבורך את קורות החיים... ⏳');
            
            // שמירה ל-localStorage
            ResumateStorage.saveChatAnswers(this.answers);
            
            // מעבר לדף הבא
            setTimeout(() => {
                window.location.href = 'resume-preview.html';
            }, 2000);
        }, 1000);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumateChat;
}
