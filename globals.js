// Global variables and helper functions
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const treeCollisionMargin = 40;
const treeChopMargin = 10;  // Added treeChopMargin definition
let woodCount = 0;
let playerHealth = 200;  // Added global variable for player's health

function getDirectionRow(direction) {
  switch(direction) {
    case 'down': return 0;
    case 'left': return 1;
    case 'right': return 2;
    case 'up': return 3;
    default: return 0;
  }
}

function collides(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect2.height > rect2.y;
}
