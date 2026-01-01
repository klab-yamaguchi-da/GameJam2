// 酒瓶クラス（旧タル）
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

        // プラットフォームとの衝突判定
        let onPlatform = false;
        for (let platform of platforms) {
            if (this.x + this.radius > platform.x &&
                this.x - this.radius < platform.x + platform.width &&
                this.y + this.radius > platform.y &&
                this.y + this.radius <= platform.y + CONFIG.PLATFORM.HEIGHT + Math.abs(this.velocityY)) {
                
                if (this.velocityY >= 0) {
                    this.y = platform.y - this.radius;
                    this.velocityY = 0;
                    onPlatform = true;
                    
                    // プラットフォームの端に達したら方向転換
                    if (this.x - this.radius < platform.x) {
                        this.x = platform.x + this.radius;
                        this.velocityX = CONFIG.BARREL.SPEED;
                        this.direction = 1;
                    } else if (this.x + this.radius > platform.x + platform.width) {
                        this.x = platform.x + platform.width - this.radius;
                        this.velocityX = -CONFIG.BARREL.SPEED;
                        this.direction = -1;
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
        
        // 酒瓶の本体（緑色のボトル）
        ctx.fillStyle = CONFIG.BARREL.COLOR;
        
        // ボトルの形状
        ctx.beginPath();
        ctx.moveTo(-6, -this.radius);
        ctx.lineTo(-6, this.radius - 3);
        ctx.lineTo(6, this.radius - 3);
        ctx.lineTo(6, -this.radius);
        ctx.closePath();
        ctx.fill();
        
        // ボトルの首
        ctx.fillStyle = CONFIG.BARREL.COLOR;
        ctx.fillRect(-3, -this.radius - 3, 6, 3);
        
        // キャップ
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-4, -this.radius - 5, 8, 2);
        
        // ラベル
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5, -2, 10, 4);
        
        // ハイライト
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-5, -this.radius + 2, 2, this.radius);
        
        ctx.restore();
    }
}
