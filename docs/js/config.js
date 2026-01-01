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
        CLIMB_SPEED: 2,
        GOAL_COLLISION_DISTANCE: 30,
        // 新入社員のカラー設定
        SUIT_COLOR: '#000000',      // スーツ（黒）
        SHIRT_COLOR: '#ffffff',     // ワイシャツ（白）
        TIE_COLOR: '#ff0000',       // ネクタイ（赤）
        SKIN_COLOR: '#ffdbac',      // 肌色
        HAIR_COLOR: '#000000',      // 髪（黒）
        EYE_COLOR: '#000000',       // 目
        SHOES_COLOR: '#8B4513',     // 靴（茶色）
        BOX_COLOR: '#D2691E',       // 段ボール箱
        BOX_TAPE_COLOR: '#8B4513'   // 段ボールのテープ
    },
    
    // 酒瓶設定
    BARREL: {
        RADIUS: 10,
        SPEED: 2,
        SPAWN_INTERVAL: 2000, // ミリ秒
        COLOR: '#2d5016', // 緑色のボトル
        CAP_COLOR: '#8B4513', // キャップ（茶色）
        LABEL_COLOR: '#ffffff', // ラベル（白）
        HIGHLIGHT_COLOR: 'rgba(255, 255, 255, 0.3)', // ハイライト
        LADDER_DESCENT_PROBABILITY: 0.02
    },
    
    // 酔っぱらい設定
    DONKEY_KONG: {
        WIDTH: 40,
        HEIGHT: 50,
        COLOR: '#ffffff', // 白い服
        FACE_COLOR: '#ff0000', // 赤い顔
        MOUTH_COLOR: '#000000', // 口
        BLUSH_COLOR: 'rgba(255, 100, 100, 0.5)' // 頬の赤み
    },
    
    // 扉設定
    PRINCESS: {
        WIDTH: 30,
        HEIGHT: 40,
        COLOR: '#8B4513', // 茶色の扉
        FRAME_COLOR: '#654321', // 扉の枠
        KNOB_COLOR: '#FFD700', // ドアノブ（金色）
        LIGHT_EFFECT_COLOR: 'rgba(255, 215, 0, 0.3)' // 光の効果
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
            { x: 700, y: 180, height: 100 },
            { x: 300, y: 80, height: 100 }
        ],
        donkeyKong: { x: 300, y: 30 },
        princess: { x: 700, y: 50 },
        playerStart: { x: 50, y: 550 }
    }
];
