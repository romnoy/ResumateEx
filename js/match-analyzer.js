/**
 * Resumate Match Analyzer
 * ניתוח התאמה למשרה
 */

const MatchAnalyzer = {
    /**
     * חישוב ציון התאמה למשרה
     */
    calculateMatchScore() {
        const data = ResumateStorage.getAllData();
        const config = ResumateConfig.MATCH_ANALYSIS;
        
        let score = config.BASE_SCORE;
        
        // בדיקה אם יש נתוני אישיות
        if (data.personality && data.personality.type) {
            // בדיקת התאמה בין טיפוס האישיות לתחום המשרה
            const isMatch = this.checkPersonalityJobMatch(
                data.personality.type,
                data.job.jobField
            );
            
            if (isMatch) {
                score += config.PERSONALITY_MATCH_BONUS;
            } else {
                score += config.DATA_ONLY_BONUS;
            }
        } else {
            // אין נתוני אישיות - רק בונוס קטן
            score += config.DATA_ONLY_BONUS;
        }
        
        // וידוא שהציון לא עובר את המקסימום
        return Math.min(score, config.MAX_SCORE);
    },

    /**
     * בדיקת התאמה בין טיפוס אישיות לתחום משרה
     */
    checkPersonalityJobMatch(personalityType, jobField) {
        if (!personalityType || !jobField) return false;
        
        const personality = ResumateConfig.PERSONALITY_TYPES[personalityType];
        if (!personality || !personality.keywords) return false;
        
        const jobFieldLower = jobField.toLowerCase();
        
        // בדיקה אם אחת ממילות המפתח מופיעה בתחום המשרה
        return personality.keywords.some(keyword => 
            jobFieldLower.includes(keyword.toLowerCase())
        );
    },

    /**
     * קבלת מידע על טיפוס האישיות
     */
    getPersonalityInfo() {
        const personalityData = ResumateStorage.getPersonality();
        
        if (!personalityData || !personalityData.type) {
            return null;
        }
        
        const type = personalityData.type;
        const personality = ResumateConfig.PERSONALITY_TYPES[type];
        
        return {
            type: type,
            ...personality,
            scores: personalityData.scores
        };
    },

    /**
     * יצירת ניתוח מלא
     */
    generateFullAnalysis() {
        const score = this.calculateMatchScore();
        const personalityInfo = this.getPersonalityInfo();
        const jobData = ResumateStorage.getJobData();
        
        return {
            score: score,
            personality: personalityInfo,
            jobField: jobData.jobField,
            jobDescription: jobData.jobDescription,
            recommendations: this.generateRecommendations(score, personalityInfo)
        };
    },

    /**
     * יצירת המלצות בהתאם לציון
     */
    generateRecommendations(score, personalityInfo) {
        const recommendations = [];
        
        if (score >= 90) {
            recommendations.push({
                icon: '🎯',
                title: 'התאמה מצוינת!',
                text: 'קורות החיים שלך מתאימים מאוד למשרה. המשך להדגיש את החוזקות שזוהו.'
            });
        } else if (score >= 80) {
            recommendations.push({
                icon: '👍',
                title: 'התאמה טובה',
                text: 'יש לך בסיס חזק. נסה להדגיש עוד יותר את הניסיון הרלוונטי.'
            });
        } else {
            recommendations.push({
                icon: '💡',
                title: 'יש מקום לשיפור',
                text: 'נסה להתאים את קורות החיים בצורה ספציפית יותר לדרישות המשרה.'
            });
        }
        
        if (personalityInfo) {
            recommendations.push({
                icon: personalityInfo.icon,
                title: `טיפוס ${personalityInfo.hebrewTitle}`,
                text: `החוזקות שלך: ${personalityInfo.traits.map(t => t.title).join(', ')}`
            });
        }
        
        return recommendations;
    },

    /**
     * הצגת ניתוח בדף
     */
    displayAnalysis() {
        const analysis = this.generateFullAnalysis();
        
        // עדכון ציון
        const scoreElement = document.getElementById('matchScore');
        if (scoreElement) {
            scoreElement.textContent = analysis.score;
        }
        
        // עדכון תחום משרה
        const jobFieldElement = document.getElementById('jobFieldDisplay');
        if (jobFieldElement && analysis.jobField) {
            jobFieldElement.textContent = analysis.jobField;
        }
        
        // הצגת טיפוס אישיות
        if (analysis.personality) {
            this.displayPersonalityInfo(analysis.personality);
        }
        
        // הצגת המלצות
        this.displayRecommendations(analysis.recommendations);
        
        return analysis;
    },

    /**
     * הצגת מידע על טיפוס האישיות
     */
    displayPersonalityInfo(personality) {
        const container = document.getElementById('personalityInfo');
        if (!container) return;
        
        container.innerHTML = `
            <div class="personality-card">
                <div class="personality-icon">${personality.icon}</div>
                <h3>${personality.hebrewTitle}</h3>
                <p class="text-muted">${personality.title}</p>
                <p>${personality.description}</p>
            </div>
        `;
    },

    /**
     * הצגת המלצות
     */
    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="recommendation-icon">${rec.icon}</div>
                <h5>${rec.title}</h5>
                <p>${rec.text}</p>
            </div>
        `).join('');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchAnalyzer;
}
