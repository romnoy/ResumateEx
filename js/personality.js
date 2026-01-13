/**
 * Resumate Personality Assessment Module
 * ניהול מבחן האישיות
 */

const PersonalityAssessment = {
    /**
     * אתחול מבחן האישיות
     */
    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
    },

    /**
     * הגדרת ולידציה בזמן אמת
     */
    setupFormValidation() {
        const submitBtn = document.getElementById('submitBtn');
        const validationMessage = document.getElementById('validationMessage');
        
        // פונקציה לבדיקת כל השאלות
        const checkAllQuestionsAnswered = () => {
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]:checked');
            const q4 = document.querySelector('input[name="q4"]:checked');
            
            const allAnswered = q1 && q2 && q3 && q4;
            
            submitBtn.disabled = !allAnswered;
            
            if (!allAnswered) {
                validationMessage.classList.add('show');
            } else {
                validationMessage.classList.remove('show');
            }
        };
        
        // בדיקה ראשונית
        submitBtn.disabled = true;
        validationMessage.classList.add('show');
        
        // הוספת מאזינים לכל הרדיו כפתורים
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', checkAllQuestionsAnswered);
        });
    },

    /**
     * הגדרת טיפול בשליחת הטופס
     */
    setupFormSubmission() {
        const form = document.getElementById('assessmentForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // בדיקת תשובות
            const allAnswered = document.querySelectorAll('input[type="radio"]:checked').length === 4;
            const jobField = document.getElementById('jobField').value.trim();
            
            if (!allAnswered) {
                alert('אנא ענה על כל 4 השאלות');
                return;
            }
            
            if (!jobField || jobField === '') {
                alert('נא למלא את שדה תחום העניין/המשרה');
                document.getElementById('jobField').focus();
                return;
            }
            
            // חישוב טיפוס אישיות
            const personalityData = this.calculatePersonality();
            
            // שמירת נתוני משרה ואישיות
            const jobDescription = document.getElementById('jobDescription').value;
            ResumateStorage.saveJobData(jobField, jobDescription);
            ResumateStorage.savePersonality(personalityData);
            
            // מעבר לדף הבא
            setTimeout(() => {
                window.location.href = 'resume-structure.html';
            }, 500);
        });
    },

    /**
     * חישוב טיפוס האישיות מהתשובות
     */
    calculatePersonality() {
        const answers = {
            q1: document.querySelector('input[name="q1"]:checked').value,
            q2: document.querySelector('input[name="q2"]:checked').value,
            q3: document.querySelector('input[name="q3"]:checked').value,
            q4: document.querySelector('input[name="q4"]:checked').value
        };
        
        // ספירת כל טיפוס
        const counts = { '0': 0, '1': 0, '2': 0, '3': 0 };
        Object.values(answers).forEach(val => counts[val]++);
        
        // מציאת הטיפוס הדומיננטי
        let dominantType = '0';
        let maxCount = 0;
        for (let type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                dominantType = type;
            }
        }
        
        // מיפוי למספר לאות
        const typeMap = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
        const personalityLetter = typeMap[dominantType];
        
        return {
            type: personalityLetter,
            scores: counts,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * הצגת תוצאות במודל (אם צריך בעתיד)
     */
    displayResults(type, scores) {
        const personality = ResumateConfig.PERSONALITY_TYPES[type];
        const modalResults = document.getElementById('modalResults');

        const typeNames = {
            a: 'Executing (ביצוע)',
            b: 'Influencing (השפעה)',
            c: 'Relationship Building (קשרים)',
            d: 'Strategic Thinking (אסטרטגיה)'
        };

        const scoreBreakdownHTML = `
            <div class="score-breakdown">
                <h3 class="breakdown-title">פילוח הניקוד שלך</h3>
                ${Object.entries(scores).map(([scoreType, score]) => `
                    <div class="score-item">
                        <div class="score-header">
                            <div class="score-label">
                                ${scoreType === type ? '<span class="dominant-badge">דומיננטי</span>' : ''}
                                ${typeNames[scoreType]}
                            </div>
                            <div class="score-value">${Math.round(score)}%</div>
                        </div>
                        <div class="score-bar-container">
                            <div class="score-bar" style="width: 0%" data-width="${score}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modalResults.innerHTML = `
            <div class="result-header">
                <div class="result-icon">${personality.icon}</div>
                <h2 class="result-title">${personality.hebrewTitle}</h2>
                <p class="result-subtitle">${personality.title}</p>
            </div>
            <div class="result-body">
                <p class="result-description">${personality.description}</p>
                
                ${scoreBreakdownHTML}
                
                <div class="result-traits">
                    ${personality.traits.map(trait => `
                        <div class="trait">
                            <div class="trait-title">${trait.title}</div>
                            <div class="trait-desc">${trait.desc}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="result-roles">
                    <strong>${personality.roles}</strong>
                </div>
                
                <button class="restart-btn" onclick="PersonalityAssessment.restartAssessment()">בצע מבחן מחדש</button>
            </div>
        `;

        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.add('active');

        setTimeout(() => {
            document.querySelectorAll('.score-bar').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 400);

        document.body.style.overflow = 'hidden';
    },

    /**
     * סגירת המודל
     */
    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * איפוס המבחן
     */
    restartAssessment() {
        this.closeModal();
        document.getElementById('assessmentForm').reset();
        this.setupFormValidation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalityAssessment;
}
