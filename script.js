let watermelonCount = 0;
let orangeCount = 0;
let grapesCount = 0;
let pineappleCount = 0;
let coconutCount = 0;
let bananaCount = 0;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let fruits = [];
let collectedFruits = []; // Array to hold sliced fruits for basket
let score = 0;
let gameInterval;
let timeLeft = 60; // Game time in seconds

// Paths to fruit images
const fruitImages = {
  watermelon: "images/watermelon.png",
  orange: "images/orange.png",
  grapes: "images/grapes.png",
  pineapple: "images/pineapple.png",
  coconut: "images/coconut.png",
  banana: "images/banana.png",
};

// Load sound effects
const sliceSound = new Audio("sounds/slice.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

// Basket image
const basketImg = new Image();
basketImg.src = "images/basket.png"; // Path to your basket image

// Fruit constructor
class Fruit {
  constructor(x, y, speed, type) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
    this.img = new Image();
    this.img.src = fruitImages[type];
    this.width = 40;
    this.height = 40;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
    this.draw();
  }
}

// Collected fruit class
class CollectedFruit {
  constructor(fruit) {
    this.x = fruit.x;
    this.y = fruit.y;
    this.type = fruit.type;
    this.img = new Image();
    this.img.src = fruitImages[this.type];
    this.width = 40;
    this.height = 40;
    this.basketX = canvas.width / 2 - 50; // X position of the basket
    this.basketWidth = 100; // Width of the basket
  }

  update() {
    this.y += 2; // Move the fruit down towards the basket

    // Move fruit towards the center of the basket
    const targetX = this.basketX + this.basketWidth / 2 - this.width / 2; // Center of the basket
    if (this.x < targetX) {
      this.x += 1; // Move right
    } else if (this.x > targetX) {
      this.x -= 1; // Move left
    }

    // Check if the fruit has reached the basket
    if (this.y > canvas.height - 100) { // Check against basket position
      this.y = canvas.height - 100; // Set fruit y to the basket level
    }

    this.draw();
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// Start game
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startGame();
});

function startGame() {
  fruits = [];
  collectedFruits = []; // Reset collected fruits for each game
  score = 0;
  timeLeft = 60;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;

  gameInterval = setInterval(gameLoop, 1000 / 60);

  const timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// Click event listener for fruit slicing
canvas.addEventListener("click", (e) => {
  fruits.forEach((fruit, index) => {
    if (
      e.offsetX > fruit.x &&
      e.offsetX < fruit.x + fruit.width &&
      e.offsetY > fruit.y &&
      e.offsetY < fruit.y + fruit.height
    ) {
      sliceFruit(fruit, index);
    }
  });
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(basketImg, canvas.width / 2 - 50, canvas.height - 100, 100, 100); // Draw the basket

  // Randomly generate fruits
  if (Math.random() < 0.03) generateFruit();

  // Update fruits
  fruits.forEach((fruit, index) => {
    fruit.update();

    if (fruit.y > canvas.height) {
      fruits.splice(index, 1);
    }
  });

  // Update collected fruits
  collectedFruits.forEach((collectedFruit, index) => {
    collectedFruit.update();

    // Remove fruit if it moves out of the basket area
    if (collectedFruit.y > canvas.height) {
      collectedFruits.splice(index, 1);
    }
  });
}

// Generate random fruits
function generateFruit() {
  const fruitTypes = [
    "watermelon",
    "orange",
    "grapes",
    "pineapple",
    "coconut",
    "banana",
  ];
  const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
  const x = Math.random() * (canvas.width - 40);
  const speed = type === "watermelon" ? 3 : 1 + Math.random() * 2;

  const fruit = new Fruit(x, 0, speed, type);
  fruits.push(fruit);
}

// Slice fruit and add score
function sliceFruit(fruit, index) {
  let points = 0;

  switch (fruit.type) {
    case "watermelon":
      points = 7;
      watermelonCount++;
      break;
    case "orange":
      points = 1;
      orangeCount++;
      break;
    case "grapes":
      points = -7;
      grapesCount++;
      break;
    case "pineapple":
      points = 2;
      pineappleCount++;
      break;
    case "coconut":
      points = 0.8;
      coconutCount++;
      break;
    case "banana":
      points = 0.5;
      bananaCount++;
      break;
  }

  score += points;
  document.getElementById("score").textContent = score.toFixed(1);
  sliceSound.play(); // Play the slicing sound

  // Move the sliced fruit to the basket
  collectedFruits.push(new CollectedFruit(fruit));
  fruits.splice(index, 1); // Remove the fruit from the array
}

// End game function
function endGame() {
  clearInterval(gameInterval);
  gameOverSound.play();

  let summary = `
      Game Over! Your score: ${score.toFixed(1)}\n
      Fruits Sliced:
      Watermelons: ${watermelonCount}
      Oranges: ${orangeCount}
      Grapes: ${grapesCount}
      Pineapples: ${pineappleCount}
      Coconuts: ${coconutCount}
      Bananas: ${bananaCount}
  `;

  alert(summary);

  // Reset counts
  watermelonCount = 0;
  orangeCount = 0;
  grapesCount = 0;
  pineappleCount = 0;
  coconutCount = 0;
  bananaCount = 0;

  startBtn.style.display = "block"; // Show the start button again
}
