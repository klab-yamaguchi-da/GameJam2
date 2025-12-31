// ゲーム設定定数
const CONFIG = {
    // キャンバスサイズ
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // プレイヤー設定
    PLAYER: {
        WIDTH: 20,
        HEIGHT: 30,
        SPEED: 3,
        JUMP_POWER: 12,
        GRAVITY: 0.6,
        CLIMB_SPEED: 2,
        COLOR: '#ff0000'
    },
    
    // タル設定
    BARREL: {
        RADIUS: 10,
        SPEED: 2,
        SPAWN_INTERVAL: 2000, // ミリ秒
        COLOR: '#8B4513'
    },
    
    // ドンキーコング設定
    DONKEY_KONG: {
        WIDTH: 40,
        HEIGHT: 50,
        COLOR: '#654321'
    },
    
    // プリンセス設定
    PRINCESS: {
        WIDTH: 20,
        HEIGHT: 30,
        COLOR: '#ff69b4'
    },
    
    // プラットフォーム設定
    PLATFORM: {
        COLOR: '#ff1493',
        HEIGHT: 4
    },
    
    // はしご設定
    LADDER: {
        COLOR: '#ffd700',
        WIDTH: 30
    },
    
    // ゲームルール
    INITIAL_LIVES: 3,
    POINTS_PER_BARREL: 100,
    POINTS_PER_LEVEL: 1000,
    
    // 物理
    PHYSICS: {
        GRAVITY: 0.6,
        TERMINAL_VELOCITY: 15
    }
};

// レベル設計（プラットフォームとはしごの配置）
const LEVELS = [
    {
        platforms: [
            // 各プラットフォーム: {x, y, width}
            { x: 0, y: 580, width: 800 },      // 最下層
            { x: 100, y: 480, width: 700 },    // 2層目
            { x: 0, y: 380, width: 650 },      // 3層目
            { x: 150, y: 280, width: 650 },    // 4層目
            { x: 0, y: 180, width: 550 },      // 5層目
            { x: 250, y: 80, width: 550 }      // 最上層
        ],
        ladders: [
            // 各はしご: {x, y, height}
            { x: 150, y: 480, height: 100 },
            { x: 600, y: 380, height: 100 },
            { x: 200, y: 280, height: 100 },
            { x: 700, y: 180, height: 100 },
            { x: 300, y: 80, height: 100 }
        ],
        donkeyKong: { x: 300, y: 30 },
        princess: { x: 700, y: 50 },
        playerStart: { x: 50, y: 550 }
    }
];
