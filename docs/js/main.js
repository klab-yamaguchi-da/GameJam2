// メインゲームループ
class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.game = null;
        this.gameLoop = null;
        this.currentScreen = 'title';
        this.isRetry = false; // 再チャレンジフラグ
        
        this.setupUI();
    }

    setupUI() {
        // スタートボタン
        document.getElementById('start-button').addEventListener('click', () => {
            this.showStory(0);
        });

        // ストーリー続行ボタン
        document.getElementById('story-continue-button').addEventListener('click', () => {
            this.startGame();
        });

        // リスタートボタン
        document.getElementById('restart-button').addEventListener('click', () => {
            this.isRetry = true; // 再チャレンジフラグをセット
            this.showStory(0);
        });

        // 次のステージボタン
        document.getElementById('next-stage-button').addEventListener('click', () => {
            this.nextStage();
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
            this.game = new Game(this.canvas);
        }
        
        // 指定されたレベルをロード（再チャレンジフラグを渡す）
        const levelToLoad = this.nextLevelIndex ?? 0;
        this.game.loadLevel(levelToLoad, this.isRetry);
        
        // 再チャレンジフラグをリセット
        this.isRetry = false;
        
        // UI更新
        this.updateUI();
        
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
            // すべてのステージをクリア
            this.showGameOver();
        }
    }

    runGameLoop() {
        const loop = () => {
            if (this.currentScreen !== 'game') {
                return;
            }

            const result = this.game.update();
            this.game.draw();
            this.updateUI();

            // ゲーム状態に応じた処理
            if (result === 'gameOver') {
                this.showGameOver();
                return;
            } else if (result === 'stageClear') {
                this.showStageClear();
                return;
            }

            this.gameLoop = requestAnimationFrame(loop);
        };

        loop();
    }

    updateUI() {
        if (this.game) {
            document.getElementById('lives-value').textContent = this.game.getLives();
            document.getElementById('level-value').textContent = this.game.getLevel();
        }
    }

    showGameOver() {
        this.showScreen('game-over');
    }

    showStageClear() {
        this.showScreen('stage-clear');
    }
}

// ゲーム開始
let gameManager;

window.addEventListener('load', () => {
    gameManager = new GameManager();
});
