const fruitWords = [
    "apple", "banana", "cherry", "date", "fig", "grape", 
    "kiwi", "lemon", "mango", "orange", "pear", "plum", 
    "quince", "raspberry", "strawberry", "tangerine", 
    "ugli", "voavanga", "watermelon", "xigua", "yumberry", "zucchini"
];

const otherWords = [
    "dog", "cat", "house", "tree", "car", "book", 
    "computer", "table", "chair", "phone", "flower", 
    "sun", "moon", "star", "cloud", "fish", "bird", 
    "shoe", "hat", "shirt", "pants", "socks", "guitar"
];

let selectedWords = [];
let selectedFruits = [];
let userInfo = {};

document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    userInfo.name = document.getElementById('name').value;
    userInfo.age = document.getElementById('age').value;
    userInfo.cognitive = document.getElementById('cognitive').value || "None";
    document.getElementById('user-info').classList.add('hidden');
    // document.getElementById('description').classList.add('hidden');
    startMemoryTest();
});

function startMemoryTest() {
    selectedWords = getRandomWords();
    selectedFruits = getFruitWords(selectedWords);

    document.getElementById('word-display').classList.remove('hidden');
    document.getElementById('words').textContent = selectedWords.join(', ');

    startTimer(30, document.getElementById('timer'), () => {
        document.getElementById('word-display').classList.add('hidden');
        document.getElementById('video-display').classList.remove('hidden');
        startTimer(60, document.getElementById('video-timer'), () => {
            document.getElementById('video-display').classList.add('hidden');
            document.getElementById('proceed-button').classList.remove('hidden');
        });
    });
}

function startTimer(duration, display, callback) {
    let timer = duration;
    display.textContent = `Time left: ${timer}s`;

    const timerInterval = setInterval(() => {
        timer--;
        display.textContent = `Time left: ${timer}s`;

        if (timer <= 0) {
            clearInterval(timerInterval);
            callback();
        }
    }, 1000);
}

function getRandomWords() {
    const shuffledFruits = fruitWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    const availableWords = otherWords.filter(word => !fruitWords.includes(word));
    const shuffledOthers = availableWords.sort(() => 0.5 - Math.random()).slice(0, 7);
    return shuffledFruits.concat(shuffledOthers);
}

function getFruitWords(words) {
    return words.filter(word => fruitWords.includes(word));
}

function showFruitInputBoxes() {
    console.log("Showing fruit input boxes");
    const fruitInputs = document.getElementById('fruit-inputs');
    console.log("fruitInputs:", fruitInputs);
    fruitInputs.classList.remove('hidden');
    document.getElementById('fruit-display').classList.remove('hidden'); // Ensure the parent div is also visible
    document.getElementById('proceed-button').classList.add('hidden'); // Hide the proceed button
}

function checkFruitAnswers() {
    console.log("Checking fruit answers");
    const userFruits = Array.from(document.getElementsByClassName('fruit-input')).map(input => input.value.trim().toLowerCase());
    let score = 0;
    selectedFruits.forEach(fruit => {
        if (userFruits.includes(fruit)) {
            score++;
        }
    });
    document.getElementById('result-name').textContent = userInfo.name;
    document.getElementById('result-age').textContent = userInfo.age;
    document.getElementById('result-cognitive').textContent = userInfo.cognitive;
    document.getElementById('result-score').textContent = score;

    document.getElementById('fruit-display').classList.add('hidden');
    document.getElementById('result-display').classList.remove('hidden');
}

function resetTest() {
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('description').classList.remove('hidden');
    document.getElementById('word-display').classList.add('hidden');
    document.getElementById('video-display').classList.add('hidden');
    document.getElementById('fruit-inputs').classList.add('hidden'); // Hide input boxes on reset
    document.getElementById('proceed-button').classList.add('hidden');
    document.getElementById('result-display').classList.add('hidden');
    document.getElementById('user-form').reset();
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Mini Cog Test Results", 10, 10);
    doc.autoTable({
        head: [['Name', 'Age', 'Cognitive Impairment', 'Score']],
        body: [[userInfo.name, userInfo.age, userInfo.cognitive, document.getElementById('result-score').textContent]],
    });
    doc.save("Mini_Cog_Test_Results.pdf");
}
