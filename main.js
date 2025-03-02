// Remove duplicate declarations; use globals declared in globals.js
// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const canvasWidth = canvas.width, canvasHeight = canvas.height;

  
// Load sprites
const spriteImage = new Image();
spriteImage.src = "Assets/Sword_attack/Sword_attack_full.png";
const enemySpriteImage = new Image();
enemySpriteImage.src = "Assets/Enemies/Plant1/Attack/Plant1_Attack_full.png";

// Initialize player (from player.js)
player.init();

// Main game loop:
let lastTimestamp = 0;
function gameLoop(timestamp) {
  // Debug log to confirm gameLoop is executing
  console.log("gameLoop running");
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  
  // Update player and enemy
  player.update(deltaTime, window.trees, enemy);
  enemy.update(deltaTime, window.trees, player); // Add this line to update the enemy
  
  // NEW: Wood collection code
  {
    const playerRect = { x: player.x, y: player.y, width: player.frameWidth, height: player.frameHeight };
    if (window.trees) {
      window.trees.forEach(tree => {
        const chopRect = {
          x: tree.x + treeChopMargin,
          y: tree.y + treeChopMargin,
          width: tree.image.width - 2 * treeChopMargin,
          height: tree.image.height - 2 * treeChopMargin
        };
        if (collides(playerRect, chopRect)) {
          if (typeof tree.chopCooldown !== 'number') tree.chopCooldown = 0;
          if (tree.chopCooldown <= 0) {
            tree.hitCount = (tree.hitCount || 0) + 1;
            woodCount++;
            tree.chopAnimationTimer = 500;
            tree.chopCooldown = 200;
          }
        }
        if (tree.chopCooldown > 0) {
          tree.chopCooldown -= deltaTime;
          if (tree.chopCooldown < 0) tree.chopCooldown = 0;
        }
        if (tree.chopAnimationTimer > 0) {
          tree.chopAnimationTimer -= deltaTime;
          if (tree.chopAnimationTimer < 0) tree.chopAnimationTimer = 0;
        }
      });
      window.trees = window.trees.filter(tree => (tree.hitCount || 0) < 30);
    }
  }
  
  // Clear canvas with green background
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw static trees
  if(window.drawStaticTrees) { window.drawStaticTrees(ctx); }
  
  // Draw HUD (health and wood count)
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Health: " + playerHealth, 10, 30);
  ctx.fillText("Holz: " + woodCount, canvasWidth - 150, 30);
  
  // Draw enemy and player
  enemy.draw(ctx, enemySpriteImage);
  player.draw(ctx, spriteImage);
  
  requestAnimationFrame(gameLoop);
}

spriteImage.onload = function() {
  requestAnimationFrame(gameLoop);
};
