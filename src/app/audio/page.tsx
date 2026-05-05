"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

export default function AudioPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onMeta = () => { setDuration(audio.duration || 0); setIsReady(true); };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setError("Could not load audio. Please try again.");
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); return; }
    audio.play().catch(() => {});
  }

  function skip(amt: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + amt));
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b1532; }
        @keyframes orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-28px)} }
        @keyframes orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-32px,36px)} }
        @keyframes sweep { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes fadeup { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(213,151,88,0.5)} 70%{box-shadow:0 0 0 20px rgba(213,151,88,0)} }
        .page { min-height:100vh; background:#0b1532; display:flex; align-items:center; justify-content:center; padding:40px 16px; position:relative; overflow:hidden; }
        .orb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .orb1 { width:500px; height:500px; background:rgba(47,103,222,0.25); top:-150px; left:-150px; animation:orb1 18s ease-in-out infinite; }
        .orb2 { width:400px; height:400px; background:rgba(213,151,88,0.2); bottom:-100px; right:-100px; animation:orb2 22s ease-in-out infinite; }
        .sweep { position:absolute; inset:-50%; background:conic-gradient(from 0deg, transparent 0deg, rgba(126,168,255,0.12) 70deg, transparent 140deg, rgba(244,200,154,0.1) 220deg, transparent 290deg); animation:sweep 60s linear infinite; filter:blur(60px); pointer-events:none; }
        .wrap { position:relative; width:100%; max-width:420px; animation:fadeup 700ms ease both; }
        .eyebrow { text-align:center; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:#d59758; font-weight:700; margin-bottom:16px; }
        .heading { text-align:center; font-size:28px; font-weight:700; color:#fff; line-height:1.2; margin-bottom:10px; }
        .heading span { background:linear-gradient(90deg,#d59758,#f4c89a); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .sub { text-align:center; font-size:13px; color:rgba(255,255,255,0.55); line-height:1.6; margin-bottom:28px; }
        .card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); border-radius:24px; padding:32px 28px; backdrop-filter:blur(20px); }
        .disc { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,#d59758,#e4ad72); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; box-shadow:0 14px 40px -10px rgba(213,151,88,0.6); }
        .disc.playing { animation:pulse 2s ease-out infinite; }
        .track { text-align:center; margin-bottom:24px; }
        .track-name { font-size:15px; font-weight:600; color:#fff; }
        .track-sub { font-size:11px; color:rgba(255,255,255,0.45); letter-spacing:0.15em; text-transform:uppercase; margin-top:4px; }
        .progress-wrap { position:relative; height:16px; margin-bottom:8px; }
        .progress-track { position:absolute; top:50%; left:0; right:0; height:5px; transform:translateY(-50%); background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#d59758,#f4c89a); border-radius:4px; transition:width 0.1s linear; }
        .seek { position:absolute; inset:0; width:100%; opacity:0; cursor:pointer; }
        .times { display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:24px; font-family:monospace; }
        .controls { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:4px; }
        .skip-btn { width:44px; height:44px; border-radius:50%; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.7); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; transition:all 0.2s; }
        .skip-btn:hover { border-color:rgba(213,151,88,0.4); color:#d59758; }
        .skip-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .play-btn { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#d59758,#e4ad72); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 14px 32px -8px rgba(213,151,88,0.65); transition:all 0.2s; }
        .play-btn:hover { transform:scale(1.05); box-shadow:0 18px 40px -8px rgba(213,151,88,0.85); }
        .play-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .error { color:#fca5a5; font-size:12px; text-align:center; margin-top:12px; }
        .portal-btn { display:block; margin:28px auto 0; background:linear-gradient(135deg,#d59758,#e4ad72); color:#0b1532; font-weight:700; font-size:14px; padding:14px 32px; border-radius:100px; text-decoration:none; text-align:center; box-shadow:0 14px 30px -10px rgba(213,151,88,0.6); transition:opacity 0.2s; }
        .portal-btn:hover { opacity:0.9; }
        .footer { text-align:center; font-size:11px; color:rgba(255,255,255,0.25); margin-top:24px; }
      `}</style>
      <div className="page">
        <div className="sweep" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="wrap">
          <p className="eyebrow">Auto Access · Private Message</p>
          <h1 className="heading">Your Personal <span>Approval Message</span></h1>
          <p className="sub">A message just for you. Press play to hear your personalised next steps from the Auto Access team.</p>
          <div className="card">
            <div className={"disc" + (isPlaying ? " playing" : "")}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0b1532" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3" fill="#0b1532" stroke="none"/>
                <circle cx="18" cy="16" r="3" fill="#0b1532" stroke="none"/>
              </svg>
            </div>
            <div className="track">
              <p className="track-name">Your Next Steps Guide</p>
              <p className="track-sub">Auto Access · Approx 2 min</p>
            </div>
            <div className="progress-wrap">
              <div className="progress-track">
                <div className="progress-fill" style={{width: progress + "%"}} />
              </div>
              <input type="range" className="seek" min={0} max={duration || 100} step={0.1} value={currentTime} disabled={!isReady}
                onChange={e => { const a = audioRef.current; if(a){a.currentTime=+e.target.value; setCurrentTime(+e.target.value);} }} />
            </div>
            <div className="times"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            <div className="controls">
              <button className="skip-btn" onClick={() => skip(-10)} disabled={!isReady}>-10s</button>
              <button className="play-btn" onClick={togglePlay} disabled={!isReady}>
                {isPlaying
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="#0b1532"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="#0b1532"><path d="M8 5v14l11-7L8 5z"/></svg>
                }
              </button>
              <button className="skip-btn" onClick={() => skip(10)} disabled={!isReady}>+10s</button>
            </div>
            {error && <p className="error">{error}</p>}
            <audio ref={audioRef} src="/audio/approval-message.mp3" preload="metadata" />
          </div>
          <a href="/portal" className="portal-btn">Go to Client Portal</a>
          <p className="footer">© {new Date().getFullYear()} Auto Access · Rent-to-Own</p>
        </div>
      </div>
    </>
  );
}
