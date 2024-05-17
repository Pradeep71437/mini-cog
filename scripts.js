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
        document.getElementById("word-display").classList.add("hidden");
        document.getElementById("video-display").classList.remove("hidden");
    
        const videoContainer = document.getElementById("video-container");
        const iframe = document.createElement("iframe");
        iframe.setAttribute("width", "560");
        iframe.setAttribute("height", "315");
        iframe.setAttribute("src", "https://www.youtube.com/embed/G267g0DpCVg?si=Lb-uwST8yJ_whsP-&autoplay=1&controls=0");
        iframe.setAttribute("title", "YouTube video player");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.setAttribute("allowfullscreen", "");
        videoContainer.appendChild(iframe);
    
        let videoTimeLeft = 60;
        const videoTimer = setInterval(function () {
            document.getElementById("video-timer").textContent = `Video time left: ${videoTimeLeft} seconds`;
            videoTimeLeft--;
            if (videoTimeLeft < 0) {
                clearInterval(videoTimer);
                showFruitInputBoxes();
            }
        }, 1000);
        
        startTimer(60, document.getElementById('video-timer'), () => {
            document.getElementById('video-display').classList.add('hidden');
            showFruitInputBoxes();
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

    const combinedWords = shuffledFruits.concat(shuffledOthers);
    return shuffleArray(combinedWords);
}

function getFruitWords(words) {
    return words.filter(word => fruitWords.includes(word));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showFruitInputBoxes() {
    console.log("Showing fruit input boxes");
    const fruitInputs = document.getElementById('fruit-inputs');
    console.log("fruitInputs:", fruitInputs);
    fruitInputs.classList.remove('hidden');
    document.getElementById('fruit-display').classList.remove('hidden'); // Ensure the parent div is also visible
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

// function resetTest() {
//     document.getElementById('user-info').classList.remove('hidden');
//     document.getElementById('description').classList.remove('hidden');
//     document.getElementById('word-display').classList.add('hidden');
//     document.getElementById('video-display').classList.add('hidden');
//     document.getElementById('fruit-display').classList.add('hidden');
//     document.getElementById('fruit-inputs').classList.add('hidden');
//     document.getElementById('result-display').classList.add('hidden');
//     document.getElementById('user-form').reset();
// }

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
