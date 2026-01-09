// メインゲームループ
class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.game = null;
        this.gameLoop = null;
        this.currentScreen = 'title';
        this.isRetry = false; // 再チャレンジフラグ
        this.audioManager = new AudioManager(); // 音響システム
        
        this.setupUI();
    }

    setupUI() {
        // スタートボタン
        document.getElementById('start-button').addEventListener('click', async () => {
            // 音声システムを初期化（ユーザーインタラクション後）
            await this.audioManager.init();
            this.showStory(0);
        });

        // ストーリー続行ボタン
        document.getElementById('story-continue-button').addEventListener('click', async () => {
            // 音声システムがまだ初期化されていなければ初期化
            await this.audioManager.init();
            this.startGame();
        });

        // リスタートボタン
        document.getElementById('restart-button').addEventListener('click', async () => {
            // 音声システムがまだ初期化されていなければ初期化
            await this.audioManager.init();
            this.isRetry = true; // 再チャレンジフラグをセット
            this.showStory(0);
        });

        // 次のステージボタン
        document.getElementById('next-stage-button').addEventListener('click', async () => {
            // 音声システムがまだ初期化されていなければ初期化
            await this.audioManager.init();
            this.nextStage();
        });

        // ゲームクリアボタン
        document.getElementById('game-clear-button').addEventListener('click', () => {
            // BGMを停止してタイトルに戻る
            this.audioManager.stopBGM();
            this.showScreen('title');
        });
    }

    showScreen(screenName) {
        // すべての画面を非表示
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        // 指定された画面を表示
        const targetScreen = document.getElementById(screenName + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    showStory(levelIndex) {
        // ストーリーテキストを更新
        const levelData = LEVELS[levelIndex];
        const storyTextElement = document.querySelector('.story-text p');
        if (storyTextElement && levelData.storyMessage) {
            storyTextElement.textContent = levelData.storyMessage;
        }
        
        // 次のレベルインデックスを保存
        this.nextLevelIndex = levelIndex;
        
        this.showScreen('story');
    }

    startGame() {
        this.showScreen('game');
        
        // ゲームインスタンスを作成または再利用
        if (!this.game) {
            this.game = new Game(this.canvas, this.audioManager);
        }
        
        // 指定されたレベルをロード（再チャレンジフラグを渡す）
        const levelToLoad = this.nextLevelIndex ?? 0;
        this.game.loadLevel(levelToLoad, this.isRetry);
        
        // 再チャレンジフラグをリセット
        this.isRetry = false;
        
        // UI更新
        this.updateUI();
        
        // レベルBGMを再生
        this.audioManager.playBGM('level');
        
        // ゲームループ開始
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        this.runGameLoop();
    }

    nextStage() {
        const nextLevel = this.game.getLevel();
        
        if (nextLevel < LEVELS.length) {
            // 次のステージのストーリーを表示
            this.showStory(nextLevel);
        } else {
            // すべてのステージをクリア - ゲームクリア画面を表示
            this.showGameClear();
        }
    }

    runGameLoop() {
        const targetFPS = CONFIG.PHYSICS.FPS;
        const frameTime = 1000 / targetFPS; // ミリ秒単位のフレーム時間
        let lastFrameTime = performance.now();
        let accumulator = 0;

        const loop = (currentTime) => {
            if (this.currentScreen !== 'game') {
                return;
            }

            // 経過時間を計算
            const deltaTime = currentTime - lastFrameTime;
            lastFrameTime = currentTime;
            accumulator += deltaTime;

            // 固定タイムステップで更新（45fps）
            while (accumulator >= frameTime) {
                const result = this.game.update();
                this.updateUI();

                // ゲーム状態に応じた処理
                if (result === 'gameOver') {
                    this.audioManager.stopBGM();
                    this.showGameOver();
                    return;
                } else if (result === 'stageClear') {
                    this.audioManager.stopBGM();
                    this.audioManager.playClearSound();
                    this.showStageClear();
                    return;
                }

                accumulator -= frameTime;
            }

            // 描画は毎フレーム行う
            this.game.draw();

            this.gameLoop = requestAnimationFrame(loop);
        };

        loop(performance.now());
    }

    updateUI() {
        if (this.game) {
            document.getElementById('lives-value').textContent = this.game.getLives();
            document.getElementById('level-value').textContent = this.game.getLevel();
        }
    }

    showGameOver() {
        // ゲームオーバー音楽を再生
        this.audioManager.playBGM('gameover');
        this.showScreen('game-over');
    }

    showStageClear() {
        this.showScreen('stage-clear');
    }

    showGameClear() {
        // ゲームクリア音楽を再生
        this.audioManager.playBGM('gameclear');
        this.showScreen('game-clear');
    }
}

// ゲーム開始
let gameManager;

window.addEventListener('load', () => {
    gameManager = new GameManager();
});
