// 酔っぱらいクラス（旧ドンキーコング）
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
        
        // 白い服（体）
        ctx.fillStyle = CONFIG.DONKEY_KONG.COLOR;
        ctx.fillRect(this.x + 5, this.y + 20, this.width - 10, this.height - 20);
        
        // 赤い顔（頭）
        ctx.fillStyle = CONFIG.DONKEY_KONG.FACE_COLOR;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 目（酔っぱらいの目）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 5, this.y + 13, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 5, this.y + 13, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 瞳（ぐるぐる目）
        ctx.fillStyle = '#000000';
        const eyeOffset = this.animationFrame === 0 ? 0 : 1;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 5 + eyeOffset, this.y + 13, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 5 - eyeOffset, this.y + 13, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 口（酔っぱらいの笑顔）
        ctx.strokeStyle = CONFIG.DONKEY_KONG.MOUTH_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 18, 5, 0, Math.PI);
        ctx.stroke();
        
        // 頬の赤み
        ctx.fillStyle = CONFIG.DONKEY_KONG.BLUSH_COLOR;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 10, this.y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 + 10, this.y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 腕（アニメーション）- 白い服の袖
        ctx.strokeStyle = CONFIG.DONKEY_KONG.COLOR;
        ctx.lineWidth = 5;
        
        const armOffset = this.animationFrame === 0 ? 5 : -5;
        
        // 左腕
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 28);
        ctx.lineTo(this.x, this.y + 35 + armOffset);
        ctx.stroke();
        
        // 右腕
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 8, this.y + 28);
        ctx.lineTo(this.x + this.width, this.y + 35 + armOffset);
        ctx.stroke();
        
        ctx.restore();
    }
}

// 扉クラス（旧プリンセス）
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
        
        // 扉の本体（茶色）
        ctx.fillStyle = CONFIG.PRINCESS.COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 扉の枠
        ctx.strokeStyle = CONFIG.PRINCESS.FRAME_COLOR;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 扉の板模様（縦の線）
        ctx.strokeStyle = CONFIG.PRINCESS.FRAME_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.stroke();
        
        // ドアノブ
        ctx.fillStyle = CONFIG.PRINCESS.KNOB_COLOR;
        ctx.beginPath();
        ctx.arc(this.x + this.width - 8, this.y + this.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 光の効果（アニメーション）
        if (this.animationFrame === 0) {
            ctx.fillStyle = CONFIG.PRINCESS.LIGHT_EFFECT_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        ctx.restore();
    }
}
