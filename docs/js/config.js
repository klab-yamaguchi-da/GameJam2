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
        // LEVEL 1
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
        trashBin: { x: 10, y: 530 }, // 最下層の左端
        speedMultiplier: 1.0,
        jumpMultiplier: 1.0,
        storyMessage: '引っ越しの最後の荷物を４つ運び忘れていた！けど、もう引っ越し先で引っ越し祝いの宴会が始まっている。飲みたくなっちゃうので酒瓶を避けながら荷物運びしよう。'
    },
    {
        // LEVEL 2
        platforms: [
            // 各プラットフォーム: {x, y, width}
            { x: 0, y: 580, width: 800 },      // 最下層
            { x: 0, y: 480, width: 700 },      // 2層目
            { x: 100, y: 380, width: 700 },    // 3層目
            // 4層目: 幅30の複数プラットフォーム
            { x: 0, y: 280, width: 30 },
            { x: 150, y: 280, width: 30 },
            { x: 300, y: 280, width: 30 },
            { x: 450, y: 280, width: 30 },
            { x: 600, y: 280, width: 30 },
            { x: 200, y: 180, width: 600 },    // 5層目
            { x: 0, y: 80, width: 500 }        // 最上層
        ],
        ladders: [
            // 各はしご: {x, y, height}
            { x: 650, y: 480, height: 100 },
            { x: 150, y: 380, height: 100 },
            // 4層目の各プラットフォームの下に長さ40のはしご
            { x: 0, y: 280, height: 40 },
            { x: 300, y: 280, height: 40 },
            { x: 450, y: 280, height: 40 },
            { x: 600, y: 280, height: 40 },
            { x: 200, y: 180, height: 100 },
            { x: 750, y: 180, height: 200 },  // 5層目右端から50の位置に長さ200のはしご
            { x: 450, y: 80, height: 100 }
        ],
        donkeyKong: { x: 100, y: 30 },
        princess: { x: 400, y: 50 },
        playerStart: { x: 50, y: 550 },
        trashBin: { x: 750, y: 530 }, // 最下層の右端
        speedMultiplier: 0.5,
        jumpMultiplier: 1.5,
        storyMessage: '次の荷物は軽いけどゆっくり運ばなきゃ'
    },
    {
        // LEVEL 3
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
            // 既存のはしご（長さ100）
            { x: 150, y: 480, height: 100 },
            { x: 600, y: 380, height: 100 },
            { x: 200, y: 280, height: 100 },
            { x: 500, y: 180, height: 100 },
            { x: 300, y: 80, height: 100 },
            // 2段目、3段目、4段目に長さ20のはしごを1つずつ追加配置
            { x: 400, y: 480, height: 20 },  // 2段目
            { x: 300, y: 380, height: 20 },  // 3段目
            { x: 400, y: 280, height: 20 }   // 4段目
        ],
        donkeyKong: { x: 300, y: 30 },
        princess: { x: 700, y: 50 },
        playerStart: { x: 730, y: 550 },
        trashBin: { x: 750, y: 530 }, // 最下層の右端
        speedMultiplier: 1.0,
        jumpMultiplier: 0, // ジャンプ不可
        storyMessage: '次の荷物は重いけど台車がある'
    },
    {
        // LEVEL 4
        platforms: [
            // 各プラットフォーム: {x, y, width}
            { x: 0, y: 580, width: 800 },      // 最下層
            { x: 0, y: 480, width: 700 },      // 2層目
            { x: 100, y: 380, width: 700 },    // 3層目
            // 4層目: 幅30の複数プラットフォーム
            { x: 0, y: 280, width: 30 },
            { x: 150, y: 280, width: 30 },
            { x: 300, y: 280, width: 30 },
            { x: 450, y: 280, width: 30 },
            { x: 600, y: 280, width: 30 },
            { x: 200, y: 180, width: 600 },    // 5層目
            { x: 0, y: 80, width: 500 }        // 最上層
        ],
        ladders: [
            // 各はしご: {x, y, height}
            { x: 650, y: 480, height: 100 },
            { x: 150, y: 380, height: 100 },
            // 4層目の各プラットフォームの下に長さ40のはしご
            { x: 0, y: 280, height: 40 },
            { x: 150, y: 280, height: 40 },
            { x: 300, y: 280, height: 40 },
            { x: 450, y: 280, height: 40 },
            { x: 600, y: 280, height: 40 },
            { x: 250, y: 180, height: 100 },
            { x: 750, y: 180, height: 200 },  // 5層目右端から50の位置に長さ200のはしご
            { x: 450, y: 80, height: 100 }
        ],
        donkeyKong: { x: 100, y: 30 },
        princess: { x: 400, y: 50 },
        playerStart: { x: 50, y: 550 },
        trashBin: { x: 750, y: 530 }, // 最下層の右端
        speedMultiplier: 1.0,
        jumpMultiplier: 1.0,
        timeLimit: 20, // 20秒のタイムリミット
        storyMessage: '最後の荷物は急がなきゃ'
    }
];
