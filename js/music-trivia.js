// Music Trivia Game - Test your music knowledge
class MusicTrivia {
    constructor() {
        this.score = 0;
        this.currentQuestion = 0;
        this.questions = this.generateQuestions();
        this.init();
    }

    init() {
        this.injectStyles();
        this.createTriviaPanel();
        this.attachEventListeners();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .music-trivia-btn {
                position: fixed;
                top: 280px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #4facfe, #00f2fe);
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .music-trivia-btn:hover {
                transform: scale(1.1);
            }

            .music-trivia-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 600px;
                background: linear-gradient(135deg, rgba(79, 172, 254, 0.98), rgba(0, 242, 254, 0.98));
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 16px 56px rgba(0, 0, 0, 0.5);
                z-index: 985;
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: none;
            }

            .music-trivia-panel.active {
                display: block;
            }

            .music-trivia-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                color: white;
            }

            .music-trivia-title {
                font-size: 24px;
                font-weight: 700;
            }

            .music-trivia-score {
                font-size: 20px;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.2);
                padding: 8px 16px;
                border-radius: 20px;
            }

            .music-trivia-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                color: white;
                cursor: pointer;
            }

            .music-trivia-question {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 20px;
                color: white;
                font-size: 18px;
                font-weight: 600;
                text-align: center;
            }

            .music-trivia-answers {
                display: grid;
                gap: 12px;
                margin-bottom: 20px;
            }

            .music-trivia-answer {
                padding: 16px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid transparent;
                border-radius: 12px;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
            }

            .music-trivia-answer:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateX(4px);
            }

            .music-trivia-answer.correct {
                background: rgba(56, 239, 125, 0.6);
                border-color: #38ef7d;
            }

            .music-trivia-answer.wrong {
                background: rgba(255, 59, 48, 0.6);
                border-color: #ff3b30;
            }

            .music-trivia-next-btn {
                width: 100%;
                padding: 14px;
                background: rgba(255, 255, 255, 0.3);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                display: none;
            }

            .music-trivia-next-btn.active {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    createTriviaPanel() {
        const btn = document.createElement('button');
        btn.className = 'music-trivia-btn';
        btn.innerHTML = '<i class="fas fa-gamepad"></i>';
        btn.title = 'Music Trivia';
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.className = 'music-trivia-panel';
        panel.innerHTML = `
            <div class="music-trivia-header">
                <div class="music-trivia-title">🎵 Music Trivia</div>
                <div class="music-trivia-score">Score: <span id="triviaScore">0</span></div>
                <button class="music-trivia-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="music-trivia-question" id="triviaQuestion"></div>
            <div class="music-trivia-answers" id="triviaAnswers"></div>
            <button class="music-trivia-next-btn" id="triviaNext">Next Question</button>
        `;
        document.body.appendChild(panel);

        this.btn = btn;
        this.panel = panel;
        this.loadQuestion();
    }

    attachEventListeners() {
        this.btn.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        this.panel.querySelector('.music-trivia-close').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        this.panel.querySelector('#triviaNext').addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    generateQuestions() {
        return [
            {
                question: "Who is known as the King of Pop?",
                answers: ["Michael Jackson", "Elvis Presley", "Prince", "Madonna"],
                correct: 0
            },
            {
                question: "Which band released 'Bohemian Rhapsody'?",
                answers: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
                correct: 2
            },
            {
                question: "What year was the first iPhone released?",
                answers: ["2005", "2007", "2009", "2011"],
                correct: 1
            },
            {
                question: "Who holds the record for most Grammy Awards?",
                answers: ["Beyoncé", "Taylor Swift", "Quincy Jones", "Jay-Z"],
                correct: 0
            },
            {
                question: "Which artist's real name is Stefani Germanotta?",
                answers: ["Katy Perry", "Lady Gaga", "Ariana Grande", "Dua Lipa"],
                correct: 1
            }
        ];
    }

    loadQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.questions[this.currentQuestion];
        this.panel.querySelector('#triviaQuestion').textContent = q.question;
        
        const answersContainer = this.panel.querySelector('#triviaAnswers');
        answersContainer.innerHTML = '';
        
        q.answers.forEach((answer, index) => {
            const btn = document.createElement('div');
            btn.className = 'music-trivia-answer';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.checkAnswer(index));
            answersContainer.appendChild(btn);
        });

        this.panel.querySelector('#triviaNext').classList.remove('active');
    }

    checkAnswer(selected) {
        const q = this.questions[this.currentQuestion];
        const answers = this.panel.querySelectorAll('.music-trivia-answer');
        
        answers.forEach((answer, index) => {
            answer.style.pointerEvents = 'none';
            if (index === q.correct) {
                answer.classList.add('correct');
            } else if (index === selected) {
                answer.classList.add('wrong');
            }
        });

        if (selected === q.correct) {
            this.score++;
            this.panel.querySelector('#triviaScore').textContent = this.score;
        }

        this.panel.querySelector('#triviaNext').classList.add('active');
    }

    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    }

    showResults() {
        this.panel.querySelector('#triviaQuestion').textContent = 
            `Quiz Complete! You scored ${this.score} out of ${this.questions.length}!`;
        this.panel.querySelector('#triviaAnswers').innerHTML = 
            '<button class="music-trivia-answer" style="cursor: pointer" onclick="location.reload()">Play Again</button>';
        this.panel.querySelector('#triviaNext').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicTrivia();
});
