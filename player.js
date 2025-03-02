// ...existing code for player variables and input...
window.player = {
  x: (canvasWidth - 64) / 2, // frameWidth assumed as 64
  y: (canvasHeight - 64) / 2,
  speed: 5,
  frameWidth: 64,
  frameHeight: 64,
  currentFrameIndex: 0,
  frameTimer: 0,
  frameDuration: 100,
  currentDirection: 'down',
  keysPressed: {},
  
  init: function() {
    document.addEventListener('keydown', (event) => {
      this.keysPressed[event.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (event) => {
      delete this.keysPressed[event.key.toLowerCase()];
    });
  },
  
  update: function(deltaTime, trees, enemy) {
    let dx = 0, dy = 0;
    let moving = false;
    if(this.keysPressed['a']) { dx = -this.speed; this.currentDirection = 'left'; moving = true; }
    if(this.keysPressed['d']) { dx = this.speed; this.currentDirection = 'right'; moving = true; }
    if(this.keysPressed['w']) { dy = -this.speed; this.currentDirection = 'up'; moving = true; }
    if(this.keysPressed['s']) { dy = this.speed; this.currentDirection = 'down'; moving = true; }
    
    // Tree collision detection (using global treeCollisionMargin)
    if(trees) {
      const horizRect = { x: this.x + dx, y: this.y, width: this.frameWidth, height: this.frameHeight };
      trees.forEach(tree => {
        const treeRect = {
          x: tree.x + treeCollisionMargin,
          y: tree.y + treeCollisionMargin,
          width: tree.image.width - 2 * treeCollisionMargin,
          height: tree.image.height - 2 * treeCollisionMargin
        };
        if(collides(horizRect, treeRect)) dx = 0;
      });
      const vertRect = { x: this.x, y: this.y + dy, width: this.frameWidth, height: this.frameHeight };
      trees.forEach(tree => {
        const treeRect = {
          x: tree.x + treeCollisionMargin,
          y: tree.y + treeCollisionMargin,
          width: tree.image.width - 2 * treeCollisionMargin,
          height: tree.image.height - 2 * treeCollisionMargin
        };
        if(collides(vertRect, treeRect)) dy = 0;
      });
    }
    
    // Prevent moving into enemy if alive
    if(enemy && enemy.alive) {
      const newRect = { x: this.x + dx, y: this.y + dy, width: this.frameWidth, height: this.frameHeight };
      const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.frameWidth, height: enemy.frameHeight };
      if(collides(newRect, enemyRect)) { dx = 0; dy = 0; }
    }
    
    this.x += dx;
    this.y += dy;
    
    // Keep within canvas boundaries (using global canvasWidth/Height)
    if(this.x < 0) this.x = 0;
    if(this.y < 0) this.y = 0;
    if(this.x > canvasWidth - this.frameWidth) this.x = canvasWidth - this.frameWidth;
    if(this.y > canvasHeight - this.frameHeight) this.y = canvasHeight - this.frameHeight;
    
    // Animation frame update
    if(moving) {
      this.frameTimer += deltaTime;
      if(this.frameTimer >= this.frameDuration) {
        this.currentFrameIndex = (this.currentFrameIndex + 1) % 6;
        this.frameTimer = 0;
      }
    } else {
      this.currentFrameIndex = 0;
    }
  },
  
  draw: function(ctx, sprite) {
    const rowIndex = getDirectionRow(this.currentDirection);
    const sx = this.currentFrameIndex * this.frameWidth;
    const sy = rowIndex * this.frameHeight;
    ctx.drawImage(sprite, sx, sy, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
  }
};

// Helper for collision (shared globally)
function collides(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}
