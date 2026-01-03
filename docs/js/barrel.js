// タルクラス
class Barrel {
    constructor(x, y, direction = 1) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.BARREL.RADIUS;
        this.velocityX = CONFIG.BARREL.SPEED * direction;
        this.velocityY = 0;
        this.direction = direction;
        this.rotation = 0;
        this.active = true;
    }

    update(platforms, ladders) {
        // 重力適用
        this.velocityY += CONFIG.PHYSICS.GRAVITY;
        
        // 位置更新
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // 回転アニメーション
        this.rotation += this.velocityX * 0.1;

        // 画面の壁にぶつかったら方向転換
        if (this.x - this.radius <= 0) {
            this.x = this.radius;
            this.velocityX = CONFIG.BARREL.SPEED;
            this.direction = 1;
        } else if (this.x + this.radius >= CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.radius;
            this.velocityX = -CONFIG.BARREL.SPEED;
            this.direction = -1;
        }

        // プラットフォームとの衝突判定
        let onPlatform = false;
        for (let platform of platforms) {
            const slope = platform.slope || 0;
            
            // タルの中心X座標でのプラットフォームの高さを計算
            const platformProgress = platform.width > 0 ? (this.x - platform.x) / platform.width : 0;
            const platformY = platform.y + slope * platformProgress;
            
            if (this.x + this.radius > platform.x &&
                this.x - this.radius < platform.x + platform.width &&
                this.y + this.radius > platformY &&
                this.y + this.radius <= platformY + CONFIG.PLATFORM.HEIGHT + Math.abs(this.velocityY)) {
                
                if (this.velocityY >= 0) {
                    this.y = platformY - this.radius;
                    this.velocityY = 0;
                    onPlatform = true;
                    
                    // 傾斜によってタルの速度を調整（下り坂で加速、上り坂で減速）
                    if (slope > 0) {
                        // 右下がりの坂
                        if (this.direction > 0) {
                            // 右に移動中（下り坂）
                            this.velocityX = CONFIG.BARREL.SPEED * 1.2;
                        } else {
                            // 左に移動中（上り坂）
                            this.velocityX = -CONFIG.BARREL.SPEED * 0.8;
                        }
                    } else if (slope < 0) {
                        // 右上がりの坂
                        if (this.direction > 0) {
                            // 右に移動中（上り坂）
                            this.velocityX = CONFIG.BARREL.SPEED * 0.8;
                        } else {
                            // 左に移動中（下り坂）
                            this.velocityX = -CONFIG.BARREL.SPEED * 1.2;
                        }
                    }
                }
            }
        }

        // はしごとの衝突判定（ランダムで降りる）
        if (onPlatform && Math.random() < CONFIG.BARREL.LADDER_DESCENT_PROBABILITY) {
            for (let ladder of ladders) {
                if (this.x > ladder.x &&
                    this.x < ladder.x + CONFIG.LADDER.WIDTH) {
                    // はしごを降りる
                    this.velocityY = CONFIG.BARREL.SPEED;
                    break;
                }
            }
        }

        // 画面外に出たら非アクティブに
        if (this.x < -50 || this.x > CONFIG.CANVAS_WIDTH + 50 ||
            this.y > CONFIG.CANVAS_HEIGHT + 50) {
            this.active = false;
        }
    }

    checkCollision(player) {
        const dx = (this.x) - (player.x + player.width / 2);
        const dy = (this.y) - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < this.radius + Math.min(player.width, player.height) / 2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // タル本体
        ctx.fillStyle = CONFIG.BARREL.COLOR;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // タルの模様
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.radius, 0);
        ctx.lineTo(this.radius, 0);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(0, this.radius);
        ctx.stroke();
        
        ctx.restore();
    }
}
