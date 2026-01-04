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
        JUMP_POWER: 6,
        CLIMB_SPEED: 2,
        COLOR: '#87ceeb', // 水色のスーツ
        BOX_COLOR: '#deb887', // 段ボール箱の色
        GOAL_COLLISION_DISTANCE: 30
    },
    
    // 酒瓶設定
    BARREL: {
        RADIUS: 10,
        SPEED: 2,
        SPAWN_INTERVAL: 2000, // ミリ秒
        COLOR: '#3d6b2e', // 緑色の酒瓶
        LADDER_DESCENT_PROBABILITY: 0.02
    },
    
    // 酔っぱらい設定
    DONKEY_KONG: {
        WIDTH: 40,
        HEIGHT: 50,
        COLOR: '#9acd32', // 黄緑の服
        FACE_COLOR: '#ff4444' // 赤い顔
    },
    
    // 光る扉設定
    PRINCESS: {
        WIDTH: 20,
        HEIGHT: 30,
        COLOR: '#ffd700', // 黄金の扉
        DOOR_FRAME_COLOR: '#8b7355' // 扉の枠（茶色）
    },
    
    // ゴミ箱設定
    TRASH_BIN: {
        WIDTH: 40,
        HEIGHT: 50,
        COLOR: '#808080', // グレーのゴミ箱
        LID_COLOR: '#a9a9a9', // フタの色
        LABEL_COLOR: '#000000', // ラベルの色
        LABEL_FONT_SIZE: 10, // ラベルのフォントサイズ
        LABEL_OFFSET_Y: 10 // ラベルの位置オフセット
    },
    
    // プラットフォーム設定
    PLATFORM: {
        COLOR: '#ff1493',
        HEIGHT: 4
    },
    
    // はしご設定
    LADDER: {
        COLOR: '#ffd700',
        WIDTH: 30,
        GRAB_TOLERANCE: 10 // 上のステージから梯子を掴める範囲（ピクセル）
    },
    
    // ゲームルール
    INITIAL_LIVES: 3,
    POINTS_PER_BARREL: 100,
    POINTS_PER_LEVEL: 1000,
    
    // 物理
    PHYSICS: {
        GRAVITY: 0.6,
        TERMINAL_VELOCITY: 15,
        FPS: 60
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
            { x: 500, y: 180, height: 100 },
            { x: 300, y: 80, height: 100 }
        ],
        donkeyKong: { x: 300, y: 30 },
        princess: { x: 700, y: 50 },
        playerStart: { x: 730, y: 550 },
        trashBin: { x: 750, y: 530 } // 最下層の右端
    }
];
