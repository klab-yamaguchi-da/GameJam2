// ゴミ箱クラス
class TrashBin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.TRASH_BIN.WIDTH;
        this.height = CONFIG.TRASH_BIN.HEIGHT;
    }

    // ボトルとの衝突判定
    checkCollision(barrel) {
        return barrel.x + barrel.radius > this.x &&
               barrel.x - barrel.radius < this.x + this.width &&
               barrel.y + barrel.radius > this.y &&
               barrel.y - barrel.radius < this.y + this.height;
    }

    draw(ctx) {
        // ゴミ箱本体
        ctx.fillStyle = CONFIG.TRASH_BIN.COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // ゴミ箱のフタ
        ctx.fillStyle = CONFIG.TRASH_BIN.LID_COLOR;
        ctx.fillRect(this.x - 2, this.y - 5, this.width + 4, 5);
        
        // ゴミ箱の縁取り
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // リサイクルマーク（三角形の矢印）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        // 上の三角形
        ctx.moveTo(this.x + this.width / 2, this.y + 15);
        ctx.lineTo(this.x + this.width / 2 - 5, this.y + 25);
        ctx.lineTo(this.x + this.width / 2 + 5, this.y + 25);
        ctx.closePath();
        ctx.fill();
        
        // 左下の三角形
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 - 10, this.y + 35);
        ctx.lineTo(this.x + this.width / 2 - 5, this.y + 25);
        ctx.lineTo(this.x + this.width / 2, this.y + 35);
        ctx.closePath();
        ctx.fill();
        
        // 右下の三角形
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2 + 10, this.y + 35);
        ctx.lineTo(this.x + this.width / 2 + 5, this.y + 25);
        ctx.lineTo(this.x + this.width / 2, this.y + 35);
        ctx.closePath();
        ctx.fill();
        
        // 「ゴミ」のラベル
        ctx.fillStyle = CONFIG.TRASH_BIN.LABEL_COLOR;
        ctx.font = `bold ${CONFIG.TRASH_BIN.LABEL_FONT_SIZE}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ゴミ', this.x + this.width / 2, this.y + this.height - CONFIG.TRASH_BIN.LABEL_OFFSET_Y);
    }
}
