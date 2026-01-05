// プレイヤークラス
class Player {
    constructor(x, y, speedMultiplier = 1.0, jumpMultiplier = 1.0, audioManager = null) {
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
        this.speedMultiplier = speedMultiplier;
        this.jumpMultiplier = jumpMultiplier;
        this.audioManager = audioManager;
        
        // 歩行SE用のカウンター
        this.walkSoundCounter = 0;
        this.walkSoundInterval = 15; // フレーム数（歩行SEの間隔）
        this.wasMoving = false;
    }

    update(keys, platforms, ladders) {
        // プラットフォームとの衝突判定（先に実行して地面判定を更新）
        // この時点での地面判定は、はしご操作の判定に使用される
        this.isOnGround = false;
        this.checkPlatformCollision(platforms);

        // はしごとの接触判定
        this.checkLadderCollision(ladders, keys);

        // はしごに乗っている場合の動作
        if (this.onLadder) {
            // 上下キーのいずれかが押されている場合は登り降り
            if (keys['ArrowUp'] || keys['ArrowDown']) {
                this.isClimbing = true;
                this.velocityY = 0;
                
                if (keys['ArrowUp']) {
                    this.y -= CONFIG.PLAYER.CLIMB_SPEED;
                }
                if (keys['ArrowDown']) {
                    this.y += CONFIG.PLAYER.CLIMB_SPEED;
                }
            } else if (!this.isOnGround) {
                // はしごに掴まっているが動いていない状態（地面に立っていない場合のみ）
                // この場合も落下しないようにする
                this.isClimbing = true;
                this.velocityY = 0;
            } else {
                // 地面に立っている場合は通常状態
                this.isClimbing = false;
            }
        } else {
            this.isClimbing = false;
        }

        // 水平移動
        // はしごに掴まって登り降りしている途中（地面に立っていない状態）は左右移動を禁止
        // 地面に立っているか、はしごに掴まっていない場合は左右移動可能
        const canMoveHorizontally = !this.isClimbing || this.isOnGround;
        this.velocityX = 0;
        let isMoving = false;
        if (canMoveHorizontally) {
            if (keys['ArrowLeft']) {
                this.velocityX = -CONFIG.PLAYER.SPEED * this.speedMultiplier;
                this.direction = -1;
                isMoving = true;
            }
            if (keys['ArrowRight']) {
                this.velocityX = CONFIG.PLAYER.SPEED * this.speedMultiplier;
                this.direction = 1;
                isMoving = true;
            }
        }
        
        // 歩行SEの再生（地面に立っている状態で移動している場合）
        if (isMoving && this.isOnGround && this.audioManager) {
            this.walkSoundCounter++;
            if (this.walkSoundCounter >= this.walkSoundInterval) {
                this.audioManager.playWalkSound();
                this.walkSoundCounter = 0;
            }
        } else {
            // 移動していない場合はカウンターをリセット
            this.walkSoundCounter = 0;
        }

        // ジャンプ（地面に立っている場合のみ、はしごの上でもジャンプ可能）
        // jumpMultiplierが0の場合はジャンプ禁止
        if (keys[' '] && this.isOnGround && this.jumpMultiplier > 0) {
            this.velocityY = -CONFIG.PLAYER.JUMP_POWER * this.jumpMultiplier;
            this.isJumping = true;
            this.isOnGround = false;
            // ジャンプSEを再生
            if (this.audioManager) {
                this.audioManager.playJumpSound();
            }
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
        // 移動後の位置補正と地面判定の更新のために必要
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
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + CONFIG.PLATFORM.HEIGHT + Math.abs(this.velocityY)) {
                
                // はしご登り降り中はプラットフォームへのスナップを無効化
                // これにより、プラットフォームの上からはしごを掴んで降りることができる
                if (this.velocityY >= 0 && !this.isClimbing) { // 落下中のみ、かつはしご登り降り中でない場合
                    this.y = platform.y - this.height;
                    this.velocityY = 0;
                    this.isJumping = false;
                    this.isOnGround = true;
                }
            }
        }
    }

    checkLadderCollision(ladders, keys) {
        this.onLadder = false;
        
        // keysパラメータがnullまたはundefinedの場合は空オブジェクトとして扱う
        const safeKeys = keys || {};
        
        for (let ladder of ladders) {
            const playerCenterX = this.x + this.width / 2;
            
            // 通常の梯子との衝突判定（プレイヤーが梯子の中にいる場合）
            if (playerCenterX > ladder.x &&
                playerCenterX < ladder.x + CONFIG.LADDER.WIDTH &&
                this.y + this.height > ladder.y &&
                this.y < ladder.y + ladder.height) {
                this.onLadder = true;
                break;
            }
            
            // 上のステージから梯子を掴む判定
            // プレイヤーが地面に立っていて、下キーを押している場合
            // プレイヤーの足元に梯子の上端がある場合、梯子を掴めるようにする
            if (this.isOnGround && safeKeys['ArrowDown']) {
                const ladderTopY = ladder.y;
                const playerBottomY = this.y + this.height;
                
                // プレイヤーの足元が梯子の上端付近にあり、水平位置が梯子の範囲内の場合
                if (playerCenterX > ladder.x &&
                    playerCenterX < ladder.x + CONFIG.LADDER.WIDTH &&
                    playerBottomY >= ladderTopY &&
                    playerBottomY <= ladderTopY + CONFIG.LADDER.GRAB_TOLERANCE) {
                    this.onLadder = true;
                    break;
                }
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

    reset(x, y, speedMultiplier = 1.0, jumpMultiplier = 1.0) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.isClimbing = false;
        this.onLadder = false;
        this.isOnGround = false;
        this.speedMultiplier = speedMultiplier;
        this.jumpMultiplier = jumpMultiplier;
        this.walkSoundCounter = 0;
        this.wasMoving = false;
    }
}
