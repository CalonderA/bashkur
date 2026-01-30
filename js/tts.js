let synthesis = window.speechSynthesis;
const YANDEX_API_KEY = 'AQVN0Dhy9GyVpbvgAHt-tsP50FdHdjAMYnwUrpXz'; 
const SBER_AUTH_KEY = 'MDE5YzBkZjUtMTY4ZC03NzBlLTg1OWQtMWRlMTEzZDU1NzE4OjdmNzQ1ZGRjLWZkNDctNGFhZS05YjhjLWRlYmU3NGEwMWQ5MQ==';

let gigaChatToken = null;
let saluteSpeechToken = null;
let currentAudio = null; // Track current audio for cancellation

function stopSpeaking() {
    if (synthesis) {
        synthesis.cancel();
    }
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function getSberToken(scope) {
    const rqUid = generateUUID();
    try {
        const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${SBER_AUTH_KEY}`,
                'RqUID': rqUid,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `scope=${scope}`
        });

        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        } else {
            console.warn(`Sber Auth Failed for ${scope}:`, response.status);
            return null;
        }
    } catch (error) {
        console.warn(`Sber Auth Error for ${scope}:`, error);
        return null;
    }
}

async function ensureTokens() {
    if (!gigaChatToken) {
        gigaChatToken = await getSberToken('GIGACHAT_API_PERS');
    }
    if (!saluteSpeechToken) {
        saluteSpeechToken = await getSberToken('SALUTE_SPEECH_PERS');
    }
    return { gigaChatToken, saluteSpeechToken };
}

async function speakText(text, lang = 'ru-RU') {
    stopSpeaking();

    // Use a timeout to enforce fast response. If APIs are slow, fallback to browser TTS.
    const apiTimeout = 1000; // 1 second max for API
    const startTime = Date.now();

    try {
        const result = await Promise.race([
            (async () => {
                // Try Sber
                await ensureTokens();
                if (saluteSpeechToken) {
                    try {
                        const dictionaryItem = dictionary.find(item => item.word === text);
                        const textToSpeak = (dictionaryItem && dictionaryItem.tts) ? dictionaryItem.tts : text;
                        const ssml = `<speak>${textToSpeak}</speak>`;

                        const response = await fetch('https://smartspeech.sber.ru/rest/v1/text:synthesize', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${saluteSpeechToken}`,
                                'Content-Type': 'application/ssml',
                            },
                            body: ssml
                        });

                        if (response.ok) {
                            const blob = await response.blob();
                            const audioUrl = URL.createObjectURL(blob);
                            const audio = new Audio(audioUrl);
                            currentAudio = audio;
                            await audio.play();
                            return true;
                        }
                    } catch (e) {
                        console.error('SaluteSpeech Error:', e);
                    }
                }

                // Try Yandex
                if (!YANDEX_API_KEY || YANDEX_API_KEY === 'YOUR_YANDEX_API_KEY') {
                    return false;
                }

                const dictionaryItem = dictionary.find(item => item.word === text);
                if (dictionaryItem) {
                    const successKZ = await tryYandexTTS(text, 'kk-KZ', 'madi');
                    if (successKZ) return true;

                    const ttsText = dictionaryItem.tts || text;
                    const successRU = await tryYandexTTS(ttsText, 'ru-RU', 'filipp');
                    if (successRU) return true;
                } else {
                    const success = await tryYandexTTS(text, 'ru-RU', 'filipp');
                    if (success) return true;
                }
                
                return false;
            })(),
            new Promise((resolve) => setTimeout(() => resolve('timeout'), apiTimeout))
        ]);

        if (result === true) return; // API succeeded
        // If result is false (API failed) or 'timeout', fall through to fallback
        
    } catch (e) {
        console.warn("TTS Error:", e);
    }

    fallbackTTS(text, lang);
}

async function tryYandexTTS(text, lang, voice) {
    try {
        const url = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';
        const params = new URLSearchParams();
        const cleanText = text.replace(/<[^>]*>/g, '');
        params.append('ssml', `<speak>${cleanText}</speak>`);
        params.append('lang', lang);
        params.append('voice', voice);
        params.append('format', 'mp3');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${YANDEX_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            currentAudio = audio;
            await audio.play();
            return true;
        } else {
            console.warn(`Yandex TTS failed for ${lang}/${voice}:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Yandex TTS error for ${lang}:`, error);
        return false;
    }
}

function fallbackTTS(text, lang) {
    if (!synthesis) {
        console.warn("TTS not supported");
        return;
    }
    
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; 
    
    const voices = synthesis.getVoices();
    const ruVoice = voices.find(v => v.lang.includes('ru'));
    if (ruVoice) {
        utterance.voice = ruVoice;
    }
    
    synthesis.speak(utterance);
}

function playAudio(currentIndex) {
    const btn = document.querySelector('.icon-btn');
    if (btn) {
        btn.style.transform = "scale(0.9)";
        setTimeout(() => btn.style.transform = "scale(1)", 150);
    }
    
    if (dictionary[currentIndex]) {
        speakText(dictionary[currentIndex].word);
    }
}
