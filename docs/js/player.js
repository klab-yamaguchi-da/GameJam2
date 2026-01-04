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
        // プラットフォームとの衝突判定（先に実行して地面判定を更新）
        this.isOnGround = false;
        this.checkPlatformCollision(platforms);

        // はしごとの接触判定
        this.checkLadderCollision(ladders);

        // はしごに乗っている場合の動作
        if (this.onLadder && !this.isOnGround) {
            // 地面に立っていない状態で、上下キーのいずれかが押されている場合は登り降り
            if (keys['ArrowUp'] || keys['ArrowDown']) {
                this.isClimbing = true;
                this.velocityY = 0;
                
                if (keys['ArrowUp']) {
                    this.y -= CONFIG.PLAYER.CLIMB_SPEED;
                }
                if (keys['ArrowDown']) {
                    this.y += CONFIG.PLAYER.CLIMB_SPEED;
                }
            } else {
                // はしごに掴まっているが動いていない状態
                // この場合も落下しないようにする
                this.isClimbing = true;
                this.velocityY = 0;
            }
        } else {
            this.isClimbing = false;
        }

        // 水平移動
        // はしごに掴まって登り降りしている途中（地面に立っていない状態）は左右移動を禁止
        this.velocityX = 0;
        if (!this.isClimbing || this.isOnGround) {
            if (keys['ArrowLeft']) {
                this.velocityX = -CONFIG.PLAYER.SPEED;
                this.direction = -1;
            }
            if (keys['ArrowRight']) {
                this.velocityX = CONFIG.PLAYER.SPEED;
                this.direction = 1;
            }
        }

        // ジャンプ（地面に立っている場合のみ、はしごの上でもジャンプ可能）
        if (keys[' '] && this.isOnGround) {
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

        // プラットフォームとの衝突判定（移動後にも再チェック）
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
            // プレイヤーの足元がプラットフォームの上にあるか
            if (this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.y + this.height > platform.y &&
                this.y + this.height <= platform.y + CONFIG.PLATFORM.HEIGHT + Math.abs(this.velocityY)) {
                
                if (this.velocityY >= 0) { // 落下中のみ
                    this.y = platform.y - this.height;
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
        // 段ボール箱（プレイヤーが運んでいる）
        ctx.fillStyle = CONFIG.PLAYER.BOX_COLOR;
        ctx.fillRect(this.x, this.y - 8, this.width, 12);
        
        // 段ボールのテープ（十字）
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y - 8);
        ctx.lineTo(this.x + this.width / 2, this.y + 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 2);
        ctx.lineTo(this.x + this.width, this.y - 2);
        ctx.stroke();
        
        // 顔（頭部）
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 8);
        
        // 目
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 7, this.y + 7, 2, 2);
        ctx.fillRect(this.x + this.width - 9, this.y + 7, 2, 2);
        
        // 口（小さい）
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + 11, 4, 1);
        
        // スーツ（水色）
        ctx.fillStyle = CONFIG.PLAYER.COLOR;
        ctx.fillRect(this.x + 4, this.y + 13, this.width - 8, 12);
        
        // ネクタイ（紺色）
        ctx.fillStyle = '#000080';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + 13, 4, 8);
        
        // ズボン（濃い灰色）
        ctx.fillStyle = '#404040';
        ctx.fillRect(this.x + 4, this.y + 25, this.width - 8, 5);
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
