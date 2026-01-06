// 8ビット風サウンド生成・管理クラス
class AudioManager {
    constructor() {
        // Web Audio APIコンテキスト
        this.audioContext = null;
        this.masterGain = null;
        
        // BGM関連
        this.bgmSource = null;
        this.bgmGain = null;
        this.bgmBuffer = null;
        this.currentBgmType = null;
        
        // BGMバッファのキャッシュ
        this.cachedBgmBuffers = {};
        
        // SE用のサウンドバッファ
        this.soundBuffers = {};
        
        // 音量設定
        this.masterVolume = 0.3;
        this.bgmVolume = 0.4;
        this.seVolume = 0.8;  // SEをBGMより大きく（BGMにかき消されないように）
        
        this.initialized = false;
    }
    
    // 音声システムの初期化
    async init() {
        if (this.initialized) return;
        
        try {
            // AudioContextは最初のユーザーインタラクションで初期化する必要がある
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // マスターゲイン（全体音量）
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // BGM用ゲイン
            this.bgmGain = this.audioContext.createGain();
            this.bgmGain.gain.value = this.bgmVolume;
            this.bgmGain.connect(this.masterGain);
            
            // サウンドエフェクトを事前生成
            await this.generateAllSounds();
            
            this.initialized = true;
        } catch (error) {
            console.error('Audio initialization failed:', error);
        }
    }
    
    // すべてのサウンドを事前生成
    async generateAllSounds() {
        this.soundBuffers.walk = this.generateWalkSound();
        this.soundBuffers.jump = this.generateJumpSound();
        this.soundBuffers.death = this.generateDeathSound();
        this.soundBuffers.clear = this.generateClearSound();
    }
    
    // 歩行SE（短いピッピッという音）
    generateWalkSound() {
        const duration = 0.08;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const freq = 800; // 高めの音
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            // 矩形波（8ビット風）
            const value = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
            // エンベロープ（減衰）
            const envelope = Math.max(0, 1 - t / duration);
            data[i] = value * envelope * 0.1;
        }
        
        return buffer;
    }
    
    // ジャンプSE（上昇する音）
    generateJumpSound() {
        const duration = 0.15;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const startFreq = 300;
        const endFreq = 800;
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const progress = t / duration;
            // 周波数が上昇
            const freq = startFreq + (endFreq - startFreq) * progress;
            // 矩形波
            const value = Math.sin(2 * Math.PI * freq * t) > 0 ? 1 : -1;
            // エンベロープ
            const envelope = Math.max(0, 1 - t / duration);
            data[i] = value * envelope * 0.15;
        }
        
        return buffer;
    }
    
    // 死亡SE（下降する悲しい音）
    generateDeathSound() {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const startFreq = 600;
        const endFreq = 100;
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            const progress = t / duration;
            // 周波数が下降
            const freq = startFreq - (startFreq - endFreq) * progress;
            // 三角波
            const phase = (2 * Math.PI * freq * t) % (2 * Math.PI);
            const value = (2 / Math.PI) * Math.asin(Math.sin(phase));
            // エンベロープ
            const envelope = Math.max(0, 1 - progress);
            data[i] = value * envelope * 0.35;
        }
        
        return buffer;
    }
    
    // クリアSE（上昇する明るい音）
    generateClearSound() {
        const duration = 0.6;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // クリア音は4つの音符で構成（ファンファーレ風）
        const notes = [
            { freq: 523.25, start: 0.0, duration: 0.12 },    // C5
            { freq: 659.25, start: 0.12, duration: 0.12 },   // E5
            { freq: 783.99, start: 0.24, duration: 0.12 },   // G5
            { freq: 1046.50, start: 0.36, duration: 0.24 }   // C6
        ];
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let value = 0;
            
            for (const note of notes) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // 矩形波
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime) > 0 ? 1 : -1;
                    // エンベロープ
                    const envelope = Math.max(0, 1 - noteProgress);
                    value += wave * envelope;
                }
            }
            
            data[i] = value * 0.15;
        }
        
        return buffer;
    }
    
    // レベルBGM生成（シンプルなループ可能なメロディ）
    generateLevelBGM() {
        const duration = 8; // 8秒のループ
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // 8ビットゲーム風のメロディパターン（C major scale）
        const melody = [
            { freq: 523.25, start: 0.0, duration: 0.3 },   // C
            { freq: 587.33, start: 0.4, duration: 0.3 },   // D
            { freq: 659.25, start: 0.8, duration: 0.3 },   // E
            { freq: 523.25, start: 1.2, duration: 0.3 },   // C
            { freq: 659.25, start: 1.6, duration: 0.3 },   // E
            { freq: 783.99, start: 2.0, duration: 0.6 },   // G
            { freq: 659.25, start: 2.8, duration: 0.3 },   // E
            { freq: 587.33, start: 3.2, duration: 0.3 },   // D
            { freq: 523.25, start: 3.6, duration: 0.6 },   // C
            { freq: 392.00, start: 4.4, duration: 0.3 },   // G3
            { freq: 440.00, start: 4.8, duration: 0.3 },   // A
            { freq: 493.88, start: 5.2, duration: 0.3 },   // B
            { freq: 523.25, start: 5.6, duration: 0.6 },   // C
            { freq: 587.33, start: 6.4, duration: 0.3 },   // D
            { freq: 523.25, start: 6.8, duration: 0.6 },   // C
        ];
        
        // ベースライン（低音）
        const bassline = [
            { freq: 130.81, start: 0.0, duration: 0.8 },   // C2
            { freq: 146.83, start: 0.8, duration: 0.8 },   // D2
            { freq: 164.81, start: 1.6, duration: 0.8 },   // E2
            { freq: 196.00, start: 2.4, duration: 0.8 },   // G2
            { freq: 164.81, start: 3.2, duration: 0.8 },   // E2
            { freq: 146.83, start: 4.0, duration: 0.8 },   // D2
            { freq: 130.81, start: 4.8, duration: 0.8 },   // C2
            { freq: 196.00, start: 5.6, duration: 0.8 },   // G2
            { freq: 130.81, start: 6.4, duration: 0.8 },   // C2
            { freq: 130.81, start: 7.2, duration: 0.8 },   // C2
        ];
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let value = 0;
            
            // メロディを追加
            for (const note of melody) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // パルス波（矩形波、8ビット風）
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime) > 0 ? 0.5 : -0.5;
                    // ADSR エンベロープ（シンプル版）
                    let envelope = 1.0;
                    if (noteProgress < 0.05) {
                        envelope = noteProgress / 0.05; // アタック
                    } else if (noteProgress > 0.7) {
                        envelope = 1.0 - (noteProgress - 0.7) / 0.3; // リリース
                    }
                    value += wave * envelope * 0.3;
                }
            }
            
            // ベースラインを追加
            for (const note of bassline) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // 矩形波（より太い音）
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime) > 0 ? 0.3 : -0.3;
                    let envelope = 1.0;
                    if (noteProgress < 0.05) {
                        envelope = noteProgress / 0.05;
                    } else if (noteProgress > 0.8) {
                        envelope = 1.0 - (noteProgress - 0.8) / 0.2;
                    }
                    value += wave * envelope * 0.2;
                }
            }
            
            data[i] = Math.max(-1, Math.min(1, value));
        }
        
        return buffer;
    }
    
    // ゲームオーバー用5秒ミュージック生成（悲しい下降メロディ）
    generateGameOverMusic() {
        const duration = 5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // 悲しい下降メロディ（ゲームオーバー風）
        const melody = [
            { freq: 659.25, start: 0.0, duration: 0.4 },   // E
            { freq: 587.33, start: 0.5, duration: 0.4 },   // D
            { freq: 523.25, start: 1.0, duration: 0.4 },   // C
            { freq: 493.88, start: 1.5, duration: 0.4 },   // B
            { freq: 440.00, start: 2.0, duration: 0.6 },   // A
            { freq: 392.00, start: 2.7, duration: 0.4 },   // G
            { freq: 349.23, start: 3.2, duration: 0.5 },   // F
            { freq: 329.63, start: 3.8, duration: 1.2 },   // E (long, sad ending)
        ];
        
        // 暗いベースライン
        const bassline = [
            { freq: 164.81, start: 0.0, duration: 1.0 },   // E2
            { freq: 146.83, start: 1.0, duration: 1.0 },   // D2
            { freq: 130.81, start: 2.0, duration: 1.0 },   // C2
            { freq: 110.00, start: 3.0, duration: 2.0 },   // A1 (long)
        ];
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let value = 0;
            
            // メロディ
            for (const note of melody) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // 三角波（悲しい音）
                    const phase = (2 * Math.PI * note.freq * noteTime) % (2 * Math.PI);
                    const wave = (2 / Math.PI) * Math.asin(Math.sin(phase));
                    // エンベロープ
                    let envelope = 1.0;
                    if (noteProgress < 0.05) {
                        envelope = noteProgress / 0.05;
                    } else if (noteProgress > 0.7) {
                        envelope = 1.0 - (noteProgress - 0.7) / 0.3;
                    }
                    value += wave * envelope * 0.4;
                }
            }
            
            // ベースライン
            for (const note of bassline) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // サイン波（低音）
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime);
                    let envelope = 1.0;
                    if (noteProgress < 0.1) {
                        envelope = noteProgress / 0.1;
                    } else if (noteProgress > 0.9) {
                        envelope = 1.0 - (noteProgress - 0.9) / 0.1;
                    }
                    value += wave * envelope * 0.25;
                }
            }
            
            data[i] = Math.max(-1, Math.min(1, value));
        }
        
        return buffer;
    }
    
    // ゲームクリア用20秒ミュージック生成
    generateGameClearMusic() {
        const duration = 20;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // 祝福の長いメロディ（勝利のファンファーレ風）
        const melody = [
            // フレーズ1 (0-4秒)
            { freq: 523.25, start: 0.0, duration: 0.4 },   // C
            { freq: 523.25, start: 0.5, duration: 0.4 },   // C
            { freq: 523.25, start: 1.0, duration: 0.4 },   // C
            { freq: 659.25, start: 1.5, duration: 0.8 },   // E
            { freq: 783.99, start: 2.4, duration: 0.4 },   // G
            { freq: 1046.50, start: 2.9, duration: 0.8 },  // C6
            { freq: 783.99, start: 3.8, duration: 0.4 },   // G
            
            // フレーズ2 (4-8秒)
            { freq: 659.25, start: 4.3, duration: 0.4 },   // E
            { freq: 783.99, start: 4.8, duration: 0.4 },   // G
            { freq: 880.00, start: 5.3, duration: 0.6 },   // A
            { freq: 783.99, start: 6.0, duration: 0.4 },   // G
            { freq: 659.25, start: 6.5, duration: 0.4 },   // E
            { freq: 587.33, start: 7.0, duration: 0.8 },   // D
            
            // フレーズ3 (8-12秒)
            { freq: 523.25, start: 8.0, duration: 0.4 },   // C
            { freq: 659.25, start: 8.5, duration: 0.4 },   // E
            { freq: 783.99, start: 9.0, duration: 0.4 },   // G
            { freq: 1046.50, start: 9.5, duration: 0.6 },  // C6
            { freq: 880.00, start: 10.2, duration: 0.4 },  // A
            { freq: 783.99, start: 10.7, duration: 0.4 },  // G
            { freq: 659.25, start: 11.2, duration: 0.6 },  // E
            
            // フレーズ4 (12-16秒)
            { freq: 587.33, start: 12.0, duration: 0.4 },  // D
            { freq: 659.25, start: 12.5, duration: 0.4 },  // E
            { freq: 783.99, start: 13.0, duration: 0.4 },  // G
            { freq: 880.00, start: 13.5, duration: 0.6 },  // A
            { freq: 1046.50, start: 14.2, duration: 0.8 }, // C6
            { freq: 880.00, start: 15.1, duration: 0.4 },  // A
            { freq: 783.99, start: 15.6, duration: 0.4 },  // G
            
            // エンディング (16-20秒)
            { freq: 1046.50, start: 16.1, duration: 0.5 }, // C6
            { freq: 880.00, start: 16.7, duration: 0.5 },  // A
            { freq: 783.99, start: 17.3, duration: 0.5 },  // G
            { freq: 659.25, start: 17.9, duration: 0.5 },  // E
            { freq: 523.25, start: 18.5, duration: 1.5 },  // C (long)
        ];
        
        // ハーモニー（コード進行）
        const harmony = [
            { freq: 392.00, start: 0.0, duration: 2.0 },   // G3
            { freq: 329.63, start: 2.0, duration: 2.0 },   // E3
            { freq: 349.23, start: 4.0, duration: 2.0 },   // F3
            { freq: 392.00, start: 6.0, duration: 2.0 },   // G3
            { freq: 261.63, start: 8.0, duration: 2.0 },   // C3
            { freq: 349.23, start: 10.0, duration: 2.0 },  // F3
            { freq: 293.66, start: 12.0, duration: 2.0 },  // D3
            { freq: 392.00, start: 14.0, duration: 2.0 },  // G3
            { freq: 261.63, start: 16.0, duration: 4.0 },  // C3 (long)
        ];
        
        for (let i = 0; i < data.length; i++) {
            const t = i / sampleRate;
            let value = 0;
            
            // メロディ
            for (const note of melody) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // パルス波
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime) > 0 ? 0.5 : -0.5;
                    // エンベロープ
                    let envelope = 1.0;
                    if (noteProgress < 0.05) {
                        envelope = noteProgress / 0.05;
                    } else if (noteProgress > 0.7) {
                        envelope = 1.0 - (noteProgress - 0.7) / 0.3;
                    }
                    value += wave * envelope * 0.4;
                }
            }
            
            // ハーモニー
            for (const note of harmony) {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const noteProgress = noteTime / note.duration;
                    // サイン波（柔らかい音）
                    const wave = Math.sin(2 * Math.PI * note.freq * noteTime);
                    let envelope = 1.0;
                    if (noteProgress < 0.1) {
                        envelope = noteProgress / 0.1;
                    } else if (noteProgress > 0.9) {
                        envelope = 1.0 - (noteProgress - 0.9) / 0.1;
                    }
                    value += wave * envelope * 0.2;
                }
            }
            
            data[i] = Math.max(-1, Math.min(1, value));
        }
        
        return buffer;
    }
    
    // サウンドエフェクト再生
    playSE(seName) {
        if (!this.initialized || !this.soundBuffers[seName]) return;
        
        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.soundBuffers[seName];
            
            const gain = this.audioContext.createGain();
            gain.gain.value = this.seVolume;
            
            source.connect(gain);
            gain.connect(this.masterGain);
            
            source.start();
        } catch (error) {
            console.error(`Failed to play SE: ${seName}`, error);
        }
    }
    
    // BGM再生（ループ）
    playBGM(bgmType = 'level') {
        if (!this.initialized) return;
        
        // 既存のBGMを停止
        this.stopBGM();
        
        try {
            // BGMタイプに応じてバッファを生成またはキャッシュから取得
            let buffer;
            if (this.cachedBgmBuffers[bgmType]) {
                // キャッシュされたバッファを使用
                buffer = this.cachedBgmBuffers[bgmType];
            } else {
                // バッファを生成してキャッシュ
                if (bgmType === 'gameclear') {
                    buffer = this.generateGameClearMusic();
                } else if (bgmType === 'gameover') {
                    buffer = this.generateGameOverMusic();
                } else {
                    buffer = this.generateLevelBGM();
                }
                this.cachedBgmBuffers[bgmType] = buffer;
            }
            
            this.bgmBuffer = buffer;
            this.currentBgmType = bgmType;
            
            // BGMソースを作成
            this.bgmSource = this.audioContext.createBufferSource();
            this.bgmSource.buffer = this.bgmBuffer;
            this.bgmSource.loop = (bgmType === 'level'); // レベルBGMのみループ
            this.bgmSource.connect(this.bgmGain);
            
            this.bgmSource.start();
        } catch (error) {
            console.error('Failed to play BGM:', error);
        }
    }
    
    // BGM停止
    stopBGM() {
        if (this.bgmSource) {
            try {
                this.bgmSource.stop();
            } catch (error) {
                // すでに停止している場合のエラーを無視
            }
            this.bgmSource = null;
        }
        this.currentBgmType = null;
    }
    
    // 歩行SE再生
    playWalkSound() {
        this.playSE('walk');
    }
    
    // ジャンプSE再生
    playJumpSound() {
        this.playSE('jump');
    }
    
    // 死亡SE再生
    playDeathSound() {
        this.playSE('death');
    }
    
    // クリアSE再生
    playClearSound() {
        this.playSE('clear');
    }
}
