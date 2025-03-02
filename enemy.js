window.enemy = {
  x: 600,
  y: 400,
  frameWidth: 64,
  frameHeight: 64,
  frameIndex: 0,
  frameTimer: 0,
  frameDuration: 100,
  currentDirection: 'down',
  speedX: 2,
  speedY: 2,
  alive: true,
  hitCount: 0,
  damageCooldown: 0,
  
  update: function(deltaTime, trees, player) {
    // Update enemy movement with collision on trees and player
    let prevX = this.x, prevY = this.y;
    
    // Horizontal movement
    let nextX = this.x + this.speedX;
    let horizRect = { x: nextX, y: this.y, width: this.frameWidth, height: this.frameHeight };
    let collision = false;
    if(trees) {
      trees.forEach(tree => {
        const treeRect = {
          x: tree.x + treeCollisionMargin,
          y: tree.y + treeCollisionMargin,
          width: tree.image.width - 2 * treeCollisionMargin,
          height: tree.image.height - 2 * treeCollisionMargin
        };
        if(collides(horizRect, treeRect)) collision = true;
      });
    }
    if(player) {
      const playerRect = { x: player.x, y: player.y, width: player.frameWidth, height: player.frameHeight };
      if(collides(horizRect, playerRect)) collision = true;
    }
    if(collision) {
      this.speedX *= -1;
    } else {
      this.x = nextX;
    }
    
    // Vertical movement
    let nextY = this.y + this.speedY;
    let vertRect = { x: this.x, y: nextY, width: this.frameWidth, height: this.frameHeight };
    collision = false;
    if(trees) {
      trees.forEach(tree => {
        const treeRect = {
          x: tree.x + treeCollisionMargin,
          y: tree.y + treeCollisionMargin,
          width: tree.image.width - 2 * treeCollisionMargin,
          height: tree.image.height - 2 * treeCollisionMargin
        };
        if(collides(vertRect, treeRect)) collision = true;
      });
    }
    if(player) {
      const playerRect = { x: player.x, y: player.y, width: player.frameWidth, height: player.frameHeight };
      if(collides(vertRect, playerRect)) collision = true;
    }
    if(collision) {
      this.speedY *= -1;
    } else {
      this.y = nextY;
    }
    
    // Boundaries check
    if(this.x < 0) { this.x = 0; this.speedX *= -1; }
    if(this.y < 0) { this.y = 0; this.speedY *= -1; }
    if(this.x > canvasWidth - this.frameWidth) { this.x = canvasWidth - this.frameWidth; this.speedX *= -1; }
    if(this.y > canvasHeight - this.frameHeight) { this.y = canvasHeight - this.frameHeight; this.speedY *= -1; }
    
    // Update animation frame
    if(this.speedX !== 0 || this.speedY !== 0) {
      this.frameTimer += deltaTime;
      if(this.frameTimer >= this.frameDuration) {
        this.frameIndex = (this.frameIndex + 1) % 7;
        this.frameTimer = 0;
      }
    }
    
    // Fight simulation: use center distance check
    if(player && this.alive) {
      const pCenterX = player.x + player.frameWidth/2;
      const pCenterY = player.y + player.frameHeight/2;
      const eCenterX = this.x + this.frameWidth/2;
      const eCenterY = this.y + this.frameHeight/2;
      const dx = pCenterX - eCenterX, dy = pCenterY - eCenterY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      const fightThreshold = 80;
      if(distance < fightThreshold) {
        if(this.damageCooldown <= 0) {
          this.hitCount++;
          playerHealth -= 10;
          this.damageCooldown = 500;
        }
        if(this.hitCount >= 15) {
          this.alive = false;
        }
      }
      if(this.damageCooldown > 0) {
        this.damageCooldown -= deltaTime;
        if(this.damageCooldown < 0) this.damageCooldown = 0;
      }
    }
  },
  
  draw: function(ctx, sprite) {
    if(this.alive) {
      ctx.drawImage(sprite,
        this.frameIndex * this.frameWidth,
        getDirectionRow(this.currentDirection) * this.frameHeight,
        this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth, this.frameHeight);
    }
  }
};
