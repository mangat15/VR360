// Quiz Configuration
const quizQuestions = [
    {
        question: "Apakah alat tradisional yang digunakan oleh petani untuk mengetam padi pada zaman dahulu?",
        options: ["Cangkul", "Pisau/Sabit", "Tajak", "Kerbau untuk membajak"],
        correct: 1
    },
    {
        question: "Mengapakah air perlu dikeluarkan sebelum mengetam padi?",
        options: ["Supaya batang padi tidak rosak", "Memudahkan mesin/petani untuk mengetam padi", "Mengelakkan padi menjadi terlalu berat", "Untuk mempercepatkan proses pengeringan"],
        correct: 1
    },
    {
        question: "Mengapa padi perlu dikeringkan sebelum disimpan?",
        options: ["Supaya padi tidak berkulat", "Untuk menambah rasa padi", "Supaya padi lebih mudah digiling", "Untuk menjadikan padi lebih ringan"],
        correct: 0
    },
    {
        question: "Berikan contoh haiwan perosak bagi padi.",
        options: ["Siput gondang", "Kucing", "Ayam kampung", "Arnab"],
        correct: 0
    },
    {
        question: "Bagaimanakah proses milling dilakukan pada zaman tradisional?",
        options: ["Mengisar dengan batu giling", "Menggunakan kilang moden", "Tumbuk padi dengan lesung", "Menggunakan mesin pengisar"],
        correct: 2
    },
    {
        question: "Apakah cara penyediaan benih padi sebelum disemai (dihambur)?",
        options: ["Rendam di sistem perairan padi", "Jemur di bawah matahari tanpa rendaman", "Campur dengan baja kimia terus", "Simpan dalam guni sebelum ditabur"],
        correct: 0
    }
];

// Quiz State
let currentQuestion = 0;
let userAnswers = [];
let quizScore = 0;

// Open Quiz
function openQuiz() {
    document.getElementById('quiz-overlay').style.display = 'flex';
    resetQuiz();

    // Switch to quiz music
    switchToQuizMusic();
}

// Close Quiz
function closeQuiz() {
    document.getElementById('quiz-overlay').style.display = 'none';

    // Switch back to tour music
    switchToTourMusic();

    // Return to scene 9
    if (typeof goToImage === 'function') {
        goToImage(9);
    }
}

// Reset Quiz
function resetQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    quizScore = 0;

    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-results').classList.remove('active');
    document.getElementById('quiz-nav').style.display = 'flex';

    renderQuestion();
    updateNavigationButtons();
}

// Render Current Question
function renderQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const q = quizQuestions[currentQuestion];

    let optionsHTML = '';
    q.options.forEach((option, index) => {
        const isSelected = userAnswers[currentQuestion] === index;
        optionsHTML += `
            <button class="quiz-option ${isSelected ? 'selected' : ''}"
                    onclick="selectAnswer(${index})">
                ${option}
            </button>
        `;
    });

    quizContent.innerHTML = `
        <div class="quiz-question active">
            <div class="question-text">${currentQuestion + 1}. ${q.question}</div>
            <div class="quiz-options">
                ${optionsHTML}
            </div>
        </div>
    `;
}

// Select Answer
function selectAnswer(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;

    // Update button styles
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    updateNavigationButtons();
}

// Update Navigation Buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    // Previous button
    prevBtn.disabled = currentQuestion === 0;

    // Next/Submit button
    const isLastQuestion = currentQuestion === quizQuestions.length - 1;
    const hasAnswer = userAnswers[currentQuestion] !== null;

    if (isLastQuestion) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        submitBtn.disabled = !hasAnswer;
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        nextBtn.disabled = !hasAnswer;
    }
}

// Next Question
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        renderQuestion();
        updateNavigationButtons();
    }
}

// Previous Question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
        updateNavigationButtons();
    }
}

// Submit Quiz
function submitQuiz() {
    // Calculate score
    quizScore = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            quizScore++;
        }
    });

    // Show results
    showResults();
}

// Show Results
function showResults() {
    // Stop quiz music when showing results
    const musicEntity = document.getElementById('music-entity');
    if (musicEntity && musicEntity.components.sound) {
        musicEntity.components.sound.stopSound();
    }

    const totalQuestions = quizQuestions.length;
    const wrongAnswers = totalQuestions - quizScore;
    const percentage = Math.round((quizScore / totalQuestions) * 100);

    // Update result elements
    document.getElementById('result-score').textContent = `${quizScore}/${totalQuestions}`;
    document.getElementById('correct-count').textContent = quizScore;
    document.getElementById('wrong-count').textContent = wrongAnswers;
    document.getElementById('percentage').textContent = `${percentage}%`;

    // Set message based on score
    let message = '';
    let scoreColor = '';

    if (percentage >= 80) {
        message = 'Cemerlang! Anda benar-benar memberi perhatian!';
        scoreColor = '#4CAF50';

        // Play celebration sound
        const horraySound = document.getElementById('horraySound');
        if (horraySound) {
            horraySound.currentTime = 0;
            horraySound.play().catch(e => console.log('Audio play failed:', e));
        }
    } else if (percentage >= 60) {
        message = 'Bagus! Anda telah belajar banyak tentang sawah padi!';
        scoreColor = '#FF9800';

        // Play good sound
        const goodSound = document.getElementById('goodSound');
        if (goodSound) {
            goodSound.currentTime = 0;
            goodSound.play().catch(e => console.log('Audio play failed:', e));
        }
    } else {
        message = 'Teruskan Mencoba! Cuba lagi untuk meningkatkan skor anda.';
        scoreColor = '#f44336';

        // Play cry sound
        const crySound = document.getElementById('crySound');
        if (crySound) {
            crySound.currentTime = 0;
            crySound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    document.getElementById('result-message').textContent = message;
    document.getElementById('result-score').style.color = scoreColor;

    // Hide quiz content and show results
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-nav').style.display = 'none';
    document.getElementById('quiz-results').classList.add('active');
}

// Retake Quiz
function retakeQuiz() {
    resetQuiz();
}

// Music switching functions
function switchToQuizMusic() {
    const musicEntity = document.getElementById('music-entity');
    if (musicEntity && musicEntity.components.sound) {
        // Stop current music
        musicEntity.components.sound.stopSound();

        // Switch to quiz music with fade
        setTimeout(() => {
            musicEntity.setAttribute('sound', {
                src: '#quizMusic',
                volume: 0.5,
                loop: true
            });
            musicEntity.components.sound.playSound();
        }, 100);
    }
}

function switchToTourMusic() {
    const musicEntity = document.getElementById('music-entity');
    if (musicEntity && musicEntity.components.sound) {
        // Stop quiz music
        musicEntity.components.sound.stopSound();

        // Switch back to tour music with fade
        setTimeout(() => {
            musicEntity.setAttribute('sound', {
                src: '#bgMusic',
                volume: 0.5,
                loop: true
            });
            musicEntity.components.sound.playSound();
        }, 100);
    }
}

// Initialize quiz button listener
window.addEventListener('load', function() {
    setTimeout(() => {
        const quizButton = document.getElementById('quiz-button');
        if (quizButton) {
            quizButton.addEventListener('click', function(e) {
                e.stopPropagation();
                openQuiz();
            });
        }
    }, 2000);
});