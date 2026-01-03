// プレイヤークラス
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isClimbing = false;
        this.onLadder = false;
        this.direction = 1; // 1: 右向き, -1: 左向き
        this.isOnGround = false;
    }

    update(keys, platforms, ladders) {
        // はしごとの接触判定
        this.checkLadderCollision(ladders);

        // はしごに乗っている場合の動作
        if (this.onLadder && (keys['ArrowUp'] || keys['ArrowDown'])) {
            this.isClimbing = true;
            this.velocityY = 0;
            
            if (keys['ArrowUp']) {
                this.y -= CONFIG.PLAYER.CLIMB_SPEED;
            }
            if (keys['ArrowDown']) {
                this.y += CONFIG.PLAYER.CLIMB_SPEED;
            }
        } else {
            this.isClimbing = false;
        }

        // 水平移動
        this.velocityX = 0;
        if (keys['ArrowLeft']) {
            this.velocityX = -CONFIG.PLAYER.SPEED;
            this.direction = -1;
        }
        if (keys['ArrowRight']) {
            this.velocityX = CONFIG.PLAYER.SPEED;
            this.direction = 1;
        }

        // ジャンプ
        if (keys[' '] && this.isOnGround && !this.isClimbing) {
            this.velocityY = -CONFIG.PLAYER.JUMP_POWER;
            this.isJumping = true;
            this.isOnGround = false;
        }

        // 重力適用（はしご登り中以外）
        if (!this.isClimbing) {
            this.velocityY += CONFIG.PHYSICS.GRAVITY;
            
            // 終端速度の制限
            if (this.velocityY > CONFIG.PHYSICS.TERMINAL_VELOCITY) {
                this.velocityY = CONFIG.PHYSICS.TERMINAL_VELOCITY;
            }
        }

        // 位置更新
        this.x += this.velocityX;
        this.y += this.velocityY;

        // プラットフォームとの衝突判定
        this.isOnGround = false;
        this.checkPlatformCollision(platforms);

        // 画面外チェック
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.CANVAS_WIDTH) {
            this.x = CONFIG.CANVAS_WIDTH - this.width;
        }

        // 落下死判定
        if (this.y > CONFIG.CANVAS_HEIGHT) {
            return 'dead';
        }

        return 'alive';
    }

    checkPlatformCollision(platforms) {
        for (let platform of platforms) {
            const slope = platform.slope || 0;
            
            // プレイヤーの中心X座標でのプラットフォームの高さを計算
            const platformProgress = platform.width > 0 ? (this.x + this.width / 2 - platform.x) / platform.width : 0;
            const platformY = platform.y + slope * platformProgress;
            
            // プレイヤーの足元がプラットフォームの上にあるか
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platformY - CONFIG.PLATFORM.HEIGHT &&
                this.y + this.height <= platformY + Math.abs(this.velocityY) + CONFIG.PLATFORM.HEIGHT) {
                
                if (this.velocityY >= 0) { // 落下中のみ
                    this.y = platformY - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.isOnGround = true;
                }
            }
        }
    }

    checkLadderCollision(ladders) {
        this.onLadder = false;
        
        for (let ladder of ladders) {
            const playerCenterX = this.x + this.width / 2;
            
            if (playerCenterX > ladder.x &&
                playerCenterX < ladder.x + CONFIG.LADDER.WIDTH &&
                this.y + this.height > ladder.y &&
                this.y < ladder.y + ladder.height) {
                this.onLadder = true;
                break;
            }
        }
    }

    checkGoalCollision(princess) {
        const dx = (this.x + this.width / 2) - (princess.x + princess.width / 2);
        const dy = (this.y + this.height / 2) - (princess.y + princess.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < CONFIG.PLAYER.GOAL_COLLISION_DISTANCE;
    }

    draw(ctx) {
        // スーツを着た新入社員
        
        // 段ボール箱（荷物）
        ctx.fillStyle = CONFIG.PLAYER.BOX_COLOR;
        ctx.fillRect(this.x + 2, this.y - 8, this.width - 4, 10);
        
        // 段ボールのテープ
        ctx.strokeStyle = CONFIG.PLAYER.BOX_TAPE_COLOR;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y - 3);
        ctx.lineTo(this.x + this.width - 2, this.y - 3);
        ctx.stroke();
        
        // 体（スーツ - 黒）
        ctx.fillStyle = CONFIG.PLAYER.SUIT_COLOR;
        ctx.fillRect(this.x + 4, this.y + 12, this.width - 8, 13);
        
        // ワイシャツ（白）
        ctx.fillStyle = CONFIG.PLAYER.SHIRT_COLOR;
        ctx.fillRect(this.x + 8, this.y + 13, this.width - 16, 10);
        
        // ネクタイ（赤）
        ctx.fillStyle = CONFIG.PLAYER.TIE_COLOR;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + 13);
        ctx.lineTo(this.x + this.width / 2 - 2, this.y + 22);
        ctx.lineTo(this.x + this.width / 2 + 2, this.y + 22);
        ctx.closePath();
        ctx.fill();
        
        // 頭（肌色）
        ctx.fillStyle = CONFIG.PLAYER.SKIN_COLOR;
        ctx.fillRect(this.x + 5, this.y + 2, this.width - 10, 10);
        
        // 髪（黒）
        ctx.fillStyle = CONFIG.PLAYER.HAIR_COLOR;
        ctx.fillRect(this.x + 5, this.y, this.width - 10, 4);
        
        // 目
        ctx.fillStyle = CONFIG.PLAYER.EYE_COLOR;
        ctx.fillRect(this.x + 7, this.y + 5, 2, 2);
        ctx.fillRect(this.x + this.width - 9, this.y + 5, 2, 2);
        
        // ズボン（黒）
        ctx.fillStyle = CONFIG.PLAYER.SUIT_COLOR;
        ctx.fillRect(this.x + 4, this.y + 25, 6, this.height - 25);
        ctx.fillRect(this.x + this.width - 10, this.y + 25, 6, this.height - 25);
        
        // 靴（茶色）
        ctx.fillStyle = CONFIG.PLAYER.SHOES_COLOR;
        ctx.fillRect(this.x + 2, this.y + this.height - 3, 7, 3);
        ctx.fillRect(this.x + this.width - 9, this.y + this.height - 3, 7, 3);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isClimbing = false;
        this.onLadder = false;
        this.isOnGround = false;
    }
}
