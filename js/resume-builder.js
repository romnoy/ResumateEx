/**
 * Resumate Resume Builder
 * בניית וניהול קורות חיים
 */

const ResumeBuilder = {
    /**
     * יצירת קורות חיים מלאים
     */
    generateResume() {
        const data = ResumateStorage.getAllData();
        
        return {
            personalInfo: this.buildPersonalInfo(data.chat),
            summary: this.buildSummary(data),
            experience: this.buildExperience(data.chat.workExperience),
            skills: this.buildSkills(data.chat.skills),
            education: this.buildEducation(data.chat.education),
            personality: data.personality
        };
    },

    /**
     * בניית מידע אישי
     */
    buildPersonalInfo(chatData) {
        return {
            name: chatData.userName || 'ללא שם',
            title: ResumateStorage.get(ResumateConfig.STORAGE_KEYS.JOB_FIELD) || 'מחפש/ת עבודה'
        };
    },

    /**
     * בניית סיכום מקצועי
     */
    buildSummary(data) {
        const personality = data.personality;
        const jobField = data.job.jobField;
        
        let summary = '';
        
        if (personality && personality.type) {
            const personalityInfo = ResumateConfig.PERSONALITY_TYPES[personality.type];
            summary = `מקצוען/ית בעל/ת טיפוס אישיות ${personalityInfo.hebrewTitle}. `;
        }
        
        if (jobField) {
            summary += `מחפש/ת הזדמנויות בתחום ${jobField}. `;
        }
        
        summary += 'בעל/ת ניסיון מוכח וכישורים רלוונטיים לתפקיד.';
        
        return summary;
    },

    /**
     * עיבוד ניסיון תעסוקתי
     */
    buildExperience(experienceText) {
        if (!experienceText) return [];
        
        // כאן ניתן להוסיף לוגיקה מתקדמת לפירוק הטקסט למשרות נפרדות
        // לעת עתה מחזירים את הטקסט כמות שהוא
        return [{
            raw: experienceText
        }];
    },

    /**
     * עיבוד כישורים
     */
    buildSkills(skillsText) {
        if (!skillsText) return [];
        
        // פיצול לפי פסיקים או שורות חדשות
        const skills = skillsText
            .split(/[,\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        return skills;
    },

    /**
     * עיבוד השכלה
     */
    buildEducation(educationText) {
        if (!educationText) return [];
        
        return [{
            raw: educationText
        }];
    },

    /**
     * הצגת קורות חיים בדף
     */
    displayResume() {
        const resume = this.generateResume();
        
        // עדכון שם
        const nameElement = document.getElementById('resumeName');
        if (nameElement) {
            nameElement.textContent = resume.personalInfo.name;
        }
        
        // עדכון תפקיד
        const titleElement = document.getElementById('resumeTitle');
        if (titleElement) {
            titleElement.textContent = resume.personalInfo.title;
        }
        
        // עדכון סיכום
        const summaryElement = document.getElementById('resumeSummary');
        if (summaryElement) {
            summaryElement.textContent = resume.summary;
        }
        
        // הצגת ניסיון תעסוקתי
        this.displayExperience(resume.experience);
        
        // הצגת כישורים
        this.displaySkills(resume.skills);
        
        // הצגת השכלה
        this.displayEducation(resume.education);
        
        return resume;
    },

    /**
     * הצגת ניסיון תעסוקתי
     */
    displayExperience(experience) {
        const container = document.getElementById('experienceContainer');
        if (!container) return;
        
        if (experience.length === 0) {
            container.innerHTML = '<p class="text-muted">אין מידע על ניסיון תעסוקתי</p>';
            return;
        }
        
        container.innerHTML = experience.map(exp => `
            <div class="experience-item mb-3">
                <p style="white-space: pre-wrap;">${exp.raw}</p>
            </div>
        `).join('');
    },

    /**
     * הצגת כישורים
     */
    displaySkills(skills) {
        const container = document.getElementById('skillsContainer');
        if (!container) return;
        
        if (skills.length === 0) {
            container.innerHTML = '<p class="text-muted">אין מידע על כישורים</p>';
            return;
        }
        
        container.innerHTML = skills.map(skill => `
            <span class="badge bg-primary me-2 mb-2">${skill}</span>
        `).join('');
    },

    /**
     * הצגת השכלה
     */
    displayEducation(education) {
        const container = document.getElementById('educationContainer');
        if (!container) return;
        
        if (education.length === 0) {
            container.innerHTML = '<p class="text-muted">אין מידע על השכלה</p>';
            return;
        }
        
        container.innerHTML = education.map(edu => `
            <div class="education-item mb-3">
                <p style="white-space: pre-wrap;">${edu.raw}</p>
            </div>
        `).join('');
    },

    /**
     * הורדת קורות חיים כקובץ
     */
    downloadResume(format = 'txt') {
        const resume = this.generateResume();
        
        let content = '';
        content += `${resume.personalInfo.name}\n`;
        content += `${resume.personalInfo.title}\n\n`;
        content += `${resume.summary}\n\n`;
        content += `ניסיון תעסוקתי:\n${resume.experience.map(e => e.raw).join('\n\n')}\n\n`;
        content += `כישורים:\n${resume.skills.join(', ')}\n\n`;
        content += `השכלה:\n${resume.education.map(e => e.raw).join('\n\n')}`;
        
        // יצירת קובץ להורדה
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_${resume.personalInfo.name}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeBuilder;
}
