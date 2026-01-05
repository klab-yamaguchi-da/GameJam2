// ゲームクラス
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keys = {};
        this.score = 0;
        this.lives = CONFIG.INITIAL_LIVES;
        this.startingLives = CONFIG.INITIAL_LIVES; // ゲーム開始時のライフ数を記録
        this.level = 0;
        this.gameState = 'playing'; // 'playing', 'dead', 'clear'
        
        // エンティティ
        this.player = null;
        this.barrels = [];
        this.donkeyKong = null;
        this.princess = null;
        this.trashBin = null;
        
        // レベルデータ
        this.platforms = [];
        this.ladders = [];
        
        // タイマー
        this.barrelSpawnTimer = 0;
        this.deathTimer = 0;
        this.timeLimit = null; // タイムリミット（秒）
        this.timeLimitTimer = 0; // タイムリミット用タイマー（フレーム数）
        
        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // デフォルトのスクロール動作を防止
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    loadLevel(levelIndex, isRetry = false) {
        this.level = levelIndex;
        const levelData = LEVELS[levelIndex];
        
        // ライフのリセット処理
        if (isRetry) {
            // 再チャレンジの場合：前回の開始時ライフ＋１
            this.startingLives = this.startingLives + 1;
            this.lives = this.startingLives;
        } else if (levelIndex === 0) {
            // 初回または最初のレベルに戻る場合
            this.startingLives = CONFIG.INITIAL_LIVES;
            this.lives = this.startingLives;
        }
        // それ以外（ステージクリア後の次レベル）はライフを維持
        
        // レベルデータをロード
        this.platforms = levelData.platforms;
        this.ladders = levelData.ladders;
        
        // タイムリミット設定
        this.timeLimit = levelData.timeLimit || null;
        this.timeLimitTimer = 0;
        
        // エンティティを初期化
        this.player = new Player(
            levelData.playerStart.x,
            levelData.playerStart.y,
            levelData.speedMultiplier ?? 1.0,
            levelData.jumpMultiplier ?? 1.0
        );
        
        this.donkeyKong = new DonkeyKong(
            levelData.donkeyKong.x,
            levelData.donkeyKong.y
        );
        
        this.princess = new Princess(
            levelData.princess.x,
            levelData.princess.y
        );
        
        this.trashBin = new TrashBin(
            levelData.trashBin.x,
            levelData.trashBin.y
        );
        
        this.barrels = [];
        this.barrelSpawnTimer = 0;
        this.gameState = 'playing';
    }

    update() {
        if (this.gameState === 'dead') {
            this.deathTimer++;
            if (this.deathTimer > 60) { // 約1秒待機
                this.lives--;
                if (this.lives <= 0) {
                    return 'gameOver';
                } else {
                    // プレイヤーをリセット
                    const levelData = LEVELS[this.level];
                    this.player.reset(
                        levelData.playerStart.x,
                        levelData.playerStart.y,
                        levelData.speedMultiplier ?? 1.0,
                        levelData.jumpMultiplier ?? 1.0
                    );
                    this.barrels = [];
                    
                    // タイムリミットがある場合はリセット
                    if (this.timeLimit !== null) {
                        this.timeLimitTimer = 0;
                    }
                    
                    this.gameState = 'playing';
                    this.deathTimer = 0;
                }
            }
            return 'continue';
        }

        if (this.gameState !== 'playing') {
            return this.gameState;
        }

        // タイムリミットチェック
        if (this.timeLimit !== null) {
            this.timeLimitTimer++;
            const elapsedSeconds = this.timeLimitTimer / CONFIG.PHYSICS.FPS;
            if (elapsedSeconds >= this.timeLimit) {
                // タイムオーバー
                this.gameState = 'dead';
                this.deathTimer = 0;
                return 'continue';
            }
        }

        // ドンキーコング更新
        this.donkeyKong.update();
        
        // プリンセス更新
        this.princess.update();

        // プレイヤー更新
        const playerState = this.player.update(this.keys, this.platforms, this.ladders);
        if (playerState === 'dead') {
            this.gameState = 'dead';
            this.deathTimer = 0;
            return 'continue';
        }

        // タル生成
        this.barrelSpawnTimer++;
        const framesPerSpawn = (CONFIG.BARREL.SPAWN_INTERVAL / 1000) * CONFIG.PHYSICS.FPS;
        if (this.barrelSpawnTimer > framesPerSpawn) {
            this.spawnBarrel();
            this.barrelSpawnTimer = 0;
        }

        // タル更新
        for (let i = this.barrels.length - 1; i >= 0; i--) {
            const barrel = this.barrels[i];
            barrel.update(this.platforms, this.ladders);

            // ゴミ箱との衝突判定
            if (this.trashBin.checkCollision(barrel)) {
                this.barrels.splice(i, 1);
                this.score += CONFIG.POINTS_PER_BARREL;
                continue;
            }

            // プレイヤーとの衝突判定
            if (barrel.checkCollision(this.player)) {
                this.gameState = 'dead';
                this.deathTimer = 0;
                return 'continue';
            }

            // 非アクティブなタルを削除
            if (!barrel.active) {
                this.barrels.splice(i, 1);
                this.score += CONFIG.POINTS_PER_BARREL;
            }
        }

        // ゴール判定
        if (this.player.checkGoalCollision(this.princess)) {
            this.score += CONFIG.POINTS_PER_LEVEL;
            this.gameState = 'clear';
            return 'stageClear';
        }

        return 'continue';
    }

    spawnBarrel() {
        const barrel = new Barrel(
            this.donkeyKong.x + this.donkeyKong.width / 2,
            this.donkeyKong.y + this.donkeyKong.height,
            Math.random() < 0.5 ? 1 : -1
        );
        this.barrels.push(barrel);
    }

    draw() {
        // 背景をクリア
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 背景グラデーション
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // プラットフォーム描画
        this.ctx.fillStyle = CONFIG.PLATFORM.COLOR;
        for (let platform of this.platforms) {
            this.ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                CONFIG.PLATFORM.HEIGHT
            );
        }

        // はしご描画
        this.ctx.strokeStyle = CONFIG.LADDER.COLOR;
        this.ctx.lineWidth = 3;
        for (let ladder of this.ladders) {
            // 縦の線
            this.ctx.beginPath();
            this.ctx.moveTo(ladder.x + 5, ladder.y);
            this.ctx.lineTo(ladder.x + 5, ladder.y + ladder.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(ladder.x + CONFIG.LADDER.WIDTH - 5, ladder.y);
            this.ctx.lineTo(ladder.x + CONFIG.LADDER.WIDTH - 5, ladder.y + ladder.height);
            this.ctx.stroke();
            
            // 横の段
            for (let i = 0; i < ladder.height; i += 15) {
                this.ctx.beginPath();
                this.ctx.moveTo(ladder.x + 5, ladder.y + i);
                this.ctx.lineTo(ladder.x + CONFIG.LADDER.WIDTH - 5, ladder.y + i);
                this.ctx.stroke();
            }
        }

        // ドンキーコング描画
        this.donkeyKong.draw(this.ctx);
        
        // プリンセス描画
        this.princess.draw(this.ctx);
        
        // ゴミ箱描画
        this.trashBin.draw(this.ctx);

        // タル描画
        for (let barrel of this.barrels) {
            barrel.draw(this.ctx);
        }

        // プレイヤー描画
        if (this.gameState !== 'dead') {
            this.player.draw(this.ctx);
        } else {
            // 死亡アニメーション（点滅）
            if (Math.floor(this.deathTimer / 10) % 2 === 0) {
                this.player.draw(this.ctx);
            }
        }

        // タイムリミット表示（左下）
        if (this.timeLimit !== null) {
            const elapsedSeconds = this.timeLimitTimer / CONFIG.PHYSICS.FPS;
            const remainingSeconds = Math.max(0, this.timeLimit - elapsedSeconds);
            
            this.ctx.save();
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'bottom';
            
            // 残り時間が5秒以下になったら赤色で表示
            if (remainingSeconds <= 5) {
                this.ctx.fillStyle = '#ff0000';
            }
            
            this.ctx.fillText(
                `TIME: ${remainingSeconds.toFixed(1)}`,
                10,
                this.canvas.height - 10
            );
            this.ctx.restore();
        }
    }

    getScore() {
        return this.score;
    }

    getLives() {
        return this.lives;
    }

    getLevel() {
        return this.level + 1;
    }

    getRemainingTime() {
        if (this.timeLimit === null) {
            return null;
        }
        const elapsedSeconds = this.timeLimitTimer / CONFIG.PHYSICS.FPS;
        return Math.max(0, this.timeLimit - elapsedSeconds);
    }
}
