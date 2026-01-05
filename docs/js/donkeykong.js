// ドンキーコングクラス
class DonkeyKong {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.DONKEY_KONG.WIDTH;
        this.height = CONFIG.DONKEY_KONG.HEIGHT;
        this.animationFrame = 0;
        this.animationCounter = 0;
        this.nextBottleDirection = 1; // 次に投げる瓶の方向（1: 右、-1: 左）
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
        
        // 体（黄緑の服）
        ctx.fillStyle = CONFIG.DONKEY_KONG.COLOR;
        ctx.fillRect(this.x, this.y + 10, this.width, this.height - 10);
        
        // 頭（赤い顔）
        ctx.fillStyle = CONFIG.DONKEY_KONG.FACE_COLOR;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 目（酔っ払いの@@ 目）
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('@@', this.x + this.width / 2, this.y + 15);
        
        // 口（へらへら笑顔）
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 18, 6, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        
        // 腕（アニメーション）
        ctx.strokeStyle = '#ffdbac'; // 肌色の腕
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
        
        // 次に投げる瓶を手に持って表示
        this.drawNextBottle(ctx);
        
        ctx.restore();
    }
    
    // 次に投げる瓶を手に持った状態で描画
    drawNextBottle(ctx) {
        ctx.save();
        
        // 瓶を持つ手の位置を決定（方向に応じて左右の手）
        let bottleX, bottleY;
        if (this.nextBottleDirection === 1) {
            // 右に投げる場合は右手に持つ
            bottleX = this.x + this.width + 8;
            bottleY = this.y + 30 + (this.animationFrame === 0 ? 5 : -5);
        } else {
            // 左に投げる場合は左手に持つ
            bottleX = this.x - 8;
            bottleY = this.y + 30 + (this.animationFrame === 0 ? 5 : -5);
        }
        
        // 瓶のサイズ（やや小さめ）
        const bottleRadius = CONFIG.BARREL.RADIUS * 0.8;
        
        // 瓶本体（緑色のガラス）
        ctx.fillStyle = CONFIG.BARREL.COLOR;
        ctx.fillRect(bottleX - bottleRadius * 0.6, bottleY - bottleRadius, bottleRadius * 1.2, bottleRadius * 2);
        
        // 瓶の首部分
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(bottleX - bottleRadius * 0.3, bottleY - bottleRadius * 1.3, bottleRadius * 0.6, bottleRadius * 0.3);
        
        // キャップ（金色）
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(bottleX - bottleRadius * 0.35, bottleY - bottleRadius * 1.5, bottleRadius * 0.7, bottleRadius * 0.2);
        
        // ラベル
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bottleX - bottleRadius * 0.5, bottleY - bottleRadius * 0.3, bottleRadius, bottleRadius * 0.6);
        
        // ラベルの文字「酒」
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('酒', bottleX, bottleY);
        
        ctx.restore();
    }
    
    // 次に投げる瓶の方向を設定
    setNextBottleDirection(direction) {
        this.nextBottleDirection = direction;
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
        
        // 光るエフェクト（外側の光）
        const glowIntensity = this.animationFrame === 0 ? 0.7 : 0.4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(255, 223, 0, ${glowIntensity})`;
        
        // 扉の枠
        ctx.fillStyle = CONFIG.PRINCESS.DOOR_FRAME_COLOR;
        ctx.fillRect(this.x - 5, this.y, this.width + 10, this.height);
        
        // 扉本体（黄金色）
        ctx.fillStyle = CONFIG.PRINCESS.COLOR;
        ctx.fillRect(this.x, this.y + 3, this.width, this.height - 6);
        
        // ドアノブ
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffdf00';
        ctx.beginPath();
        ctx.arc(this.x + this.width - 5, this.y + this.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 扉の装飾（縦線）
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 5);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height - 5);
        ctx.stroke();
        
        // 光の放射線（アニメーション）
        if (this.animationFrame === 0) {
            ctx.strokeStyle = `rgba(255, 255, 0, 0.6)`;
            ctx.lineWidth = 2;
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI / 4) * i;
                const length = 15;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + Math.cos(angle) * length,
                    centerY + Math.sin(angle) * length
                );
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
}
