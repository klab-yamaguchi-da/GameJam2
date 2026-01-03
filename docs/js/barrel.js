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
            if (this.x + this.radius > platform.x &&
                this.x - this.radius < platform.x + platform.width &&
                this.y + this.radius > platform.y &&
                this.y + this.radius <= platform.y + CONFIG.PLATFORM.HEIGHT + Math.abs(this.velocityY)) {
                
                if (this.velocityY >= 0) {
                    this.y = platform.y - this.radius;
                    this.velocityY = 0;
                    onPlatform = true;
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
        
        // 瓶本体（緑色のガラス）
        ctx.fillStyle = CONFIG.BARREL.COLOR;
        ctx.fillRect(-this.radius * 0.6, -this.radius, this.radius * 1.2, this.radius * 2);
        
        // 瓶の首部分
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(-this.radius * 0.3, -this.radius * 1.3, this.radius * 0.6, this.radius * 0.3);
        
        // キャップ（金色）
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-this.radius * 0.35, -this.radius * 1.5, this.radius * 0.7, this.radius * 0.2);
        
        // ラベル
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-this.radius * 0.5, -this.radius * 0.3, this.radius, this.radius * 0.6);
        
        // ラベルの文字「酒」
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('酒', 0, 0);
        
        // 光沢
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(-this.radius * 0.3, -this.radius * 0.5, this.radius * 0.2, this.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
