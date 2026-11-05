let enabled=true;
export function stop(){globalThis.speechSynthesis?.cancel();}
export function setEnabled(value){enabled=value;if(!value)stop();}
export function speak(text,notify){stop();if(!enabled){notify('語音目前關閉，按上方「語音關閉」可以開啟。');return;}if(!globalThis.speechSynthesis){notify('這個瀏覽器沒有語音功能，可以閱讀畫面文字。');return;}const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase()==='zh-tw')??voices.find(v=>v.lang.toLowerCase().startsWith('zh'));if(!voice){notify('尚未找到中文語音。請確認 Windows 已安裝中文語音；畫面文字仍可閱讀。');return;}const u=new SpeechSynthesisUtterance(text);u.lang='zh-TW';u.voice=voice;u.rate=.83;u.onerror=()=>notify('語音暫時無法播放，請閱讀畫面文字。');speechSynthesis.speak(u);}
