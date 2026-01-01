// ゲームクラス
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keys = {};
        this.score = 0;
        this.lives = CONFIG.INITIAL_LIVES;
        this.level = 0;
        this.gameState = 'playing'; // 'playing', 'dead', 'clear'
        
        // エンティティ
        this.player = null;
        this.barrels = [];
        this.donkeyKong = null;
        this.princess = null;
        
        // レベルデータ
        this.platforms = [];
        this.ladders = [];
        
        // タイマー
        this.barrelSpawnTimer = 0;
        this.deathTimer = 0;
        
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

    loadLevel(levelIndex) {
        this.level = levelIndex;
        const levelData = LEVELS[levelIndex];
        
        // レベルデータをロード
        this.platforms = levelData.platforms;
        this.ladders = levelData.ladders;
        
        // エンティティを初期化
        this.player = new Player(
            levelData.playerStart.x,
            levelData.playerStart.y
        );
        
        this.donkeyKong = new DonkeyKong(
            levelData.donkeyKong.x,
            levelData.donkeyKong.y
        );
        
        this.princess = new Princess(
            levelData.princess.x,
            levelData.princess.y
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
                        levelData.playerStart.y
                    );
                    this.barrels = [];
                    this.gameState = 'playing';
                    this.deathTimer = 0;
                }
            }
            return 'continue';
        }

        if (this.gameState !== 'playing') {
            return this.gameState;
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

        // プラットフォーム描画（斜めの線）
        this.ctx.strokeStyle = CONFIG.PLATFORM.COLOR;
        this.ctx.lineWidth = CONFIG.PLATFORM.HEIGHT;
        this.ctx.lineCap = 'round';
        for (let platform of this.platforms) {
            const slope = platform.slope || 0;
            const y1 = platform.y;
            const y2 = platform.y + slope;
            
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x, y1);
            this.ctx.lineTo(platform.x + platform.width, y2);
            this.ctx.stroke();
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
}
