// ドンキーコングクラス
class DonkeyKong {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.DONKEY_KONG.WIDTH;
        this.height = CONFIG.DONKEY_KONG.HEIGHT;
        this.animationFrame = 0;
        this.animationCounter = 0;
    }

    update() {
        // アニメーションカウンター
        this.animationCounter++;
        if (this.animationCounter > 30) {
            this.animationCounter = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // 体
        ctx.fillStyle = CONFIG.DONKEY_KONG.COLOR;
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);
        
        // 頭
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 目
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 5, this.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 5, this.y + 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 5, this.y + 12, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 5, this.y + 12, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 腕（アニメーション）
        ctx.strokeStyle = CONFIG.DONKEY_KONG.COLOR;
        ctx.lineWidth = 6;
        
        const armOffset = this.animationFrame === 0 ? 5 : -5;
        
        // 左腕
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 25);
        ctx.lineTo(this.x - 5, this.y + 30 + armOffset);
        ctx.stroke();
        
        // 右腕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 5, this.y + 25);
        ctx.lineTo(this.x + this.width + 5, this.y + 30 + armOffset);
        ctx.stroke();
        
        ctx.restore();
    }
}

// プリンセスクラス
class Princess {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PRINCESS.WIDTH;
        this.height = CONFIG.PRINCESS.HEIGHT;
        this.animationFrame = 0;
        this.animationCounter = 0;
    }

    update() {
        // アニメーションカウンター
        this.animationCounter++;
        if (this.animationCounter > 20) {
            this.animationCounter = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // ドレス
        ctx.fillStyle = CONFIG.PRINCESS.COLOR;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 10);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // 頭
        ctx.fillStyle = '#ffdbac';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 髪
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 5, 9, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // 王冠
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x + this.width / 2 - 6, this.y - 2, 12, 4);
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 6, this.y - 2);
        ctx.lineTo(this.x + this.width / 2 - 3, this.y - 6);
        ctx.lineTo(this.x + this.width / 2, this.y - 2);
        ctx.lineTo(this.x + this.width / 2 + 3, this.y - 6);
        ctx.lineTo(this.x + this.width / 2 + 6, this.y - 2);
        ctx.fill();
        
        // 目（瞬き）
        if (this.animationFrame === 0) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 - 3, this.y + 8, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2 + 3, this.y + 8, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 - 4, this.y + 8);
            ctx.lineTo(this.x + this.width / 2 - 2, this.y + 8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2 + 2, this.y + 8);
            ctx.lineTo(this.x + this.width / 2 + 4, this.y + 8);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}
