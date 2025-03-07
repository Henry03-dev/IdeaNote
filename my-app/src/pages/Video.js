import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Video = () => {
    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null); // 프레임 캡처용 숨겨진 비디오
    const canvasRef = useRef(null);
    const progressBarRef = useRef(null);

    const [thumbnail, setThumbnail] = useState(null);
    const [previewPos, setPreviewPos] = useState({ left: 0, visible: false, time: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeBar, setShowVolumeBar] = useState(false);
    const [progress, setProgress] = useState(0); // 🔥 progress 상태 추가

    let volumeTimeout = null;

    // 재생 / 정지 토글
    const togglePlay = (e) => {
        if (e.target.closest(".no-click")) return;
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
            showIconWithFadeOut();
        }
    };

    // 아이콘을 표시하고 서서히 사라지게 함
    const showIconWithFadeOut = () => {
        setShowIcon(true);
        setFadeOut(false);
        setTimeout(() => setFadeOut(true), 100);
        setTimeout(() => setShowIcon(false), 300);
    };

    // 🔥 음소거 토글
    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                setVolume(prevVolume);
                videoRef.current.volume = prevVolume;
            } else {
                setPrevVolume(volume);
                setVolume(0);
                videoRef.current.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    // 볼륨 조절
    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    // 볼륨 바 표시
    const handleMouseEnter = () => {
        if (volumeTimeout) clearTimeout(volumeTimeout);
        setShowVolumeBar(true);
    };

    // 볼륨 바 숨김 (0.3초 후)
    const handleMouseLeave = () => {
        volumeTimeout = setTimeout(() => {
            setShowVolumeBar(false);
        }, 300);
    };

    // 🔥 비디오 진행 업데이트
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percentage);
        }
    };

    useEffect(() => {
            const hiddenVideo = hiddenVideoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
    
            let animationFrameId = null;
    
            const handleMouseMove = (e) => {
                if (!hiddenVideo || !progressBarRef.current) return;
    
                const rect = progressBarRef.current.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const progress = offsetX / rect.width;
                const previewTime = hiddenVideo.duration * progress;
    
                // 숨겨진 비디오의 특정 시간으로 이동
                hiddenVideo.currentTime = previewTime;
    
                // 프레임을 실시간으로 캡처
                const updateThumbnail = () => {
                    ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
                    setThumbnail(canvas.toDataURL("image/png"));
                    setPreviewPos({ left: offsetX, visible: true, time: previewTime });
    
                    animationFrameId = requestAnimationFrame(updateThumbnail);
                };
    
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updateThumbnail);
            };
    
            const handleMouseLeave = () => {
                setPreviewPos((prev) => ({ ...prev, visible: false }));
                cancelAnimationFrame(animationFrameId);
            };
    
            if (progressBarRef.current) {
                progressBarRef.current.addEventListener("mousemove", handleMouseMove);
                progressBarRef.current.addEventListener("mouseleave", handleMouseLeave);
            }
    
            return () => {
                if (progressBarRef.current) {
                    progressBarRef.current.removeEventListener("mousemove", handleMouseMove);
                    progressBarRef.current.removeEventListener("mouseleave", handleMouseLeave);
                }
                cancelAnimationFrame(animationFrameId);
            };
        }, []);

        // 재생바 클릭 시 해당 시간으로 이동
    const handleSeek = (e) => {
        if (!videoRef.current || !progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const progress = offsetX / rect.width;
        const newTime = videoRef.current.duration * progress;

        videoRef.current.currentTime = newTime;
    };


    return (
        <div style={styles.container}>
            <div style={styles.videoWrapper} onClick={togglePlay}>
                <video ref={videoRef} width={600} style={styles.video} onTimeUpdate={handleTimeUpdate}>
                    <source src="video/sample.mp4" type="video/mp4" />
                    당신의 브라우저는 비디오 태그를 지원하지 않습니다.
                </video>

                {/* 중앙 재생/일시정지 아이콘 */}
                {showIcon && (
                    <div style={{ 
                        ...styles.playButton, 
                        opacity: fadeOut ? 0 : 1, 
                        transition: "opacity 0.5s ease-in-out"
                    }}>
                        {isPlaying ? <FaPause size={20} color="white" /> : <FaPlay size={20} color="white" />}
                    </div>
                )}

                {/* 🔥 재생 버튼 */}
                <button onClick={togglePlay} style={styles.controlButton}>
                    {isPlaying ? <FaPause size={18} color="white" /> : <FaPlay size={18} color="white" />}
                </button>

                {/* 🔥 볼륨 컨트롤 */}
                <div className="no-click" style={styles.noClickZone}>
                    <div 
                        style={styles.volumeWrapper}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button onClick={toggleMute} style={styles.volumeButton}>
                            {isMuted ? <FaVolumeMute size={18} color="white" /> : <FaVolumeUp size={18} color="white" />}
                        </button>

                        {showVolumeBar && (
                            <input 
                                type="range"
                                min="0"
                                max="0.5"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={styles.volumeSlider}
                            />
                        )}
                    </div>
                </div>

                {/* 재생바 (클릭 가능) */}
                <div className="no-click" style={styles.noClickZone2}>
                    <div
                        ref={progressBarRef}
                        style={styles.progressBar}
                        onClick={handleSeek} // 클릭 시 해당 위치로 이동
                    ></div>
                </div>
                {/* 🎞️ 썸네일 미리보기 */}
                {previewPos.visible && (
                    <img
                        src={thumbnail}
                        alt="미리보기"
                        style={{
                            position: "absolute",
                            bottom: 65,
                            left: previewPos.left,
                            width: 180,
                            height: 108,
                            transform: "translateX(-50%)",
                            border: "2px solid #fff",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                            background: "#000",
                        }}
                    />

                )}

                {/* ⏳ 숨겨진 비디오 (프레임 캡처 전용) */}
                <video ref={hiddenVideoRef} width={160} height={90} style={{ display: "none" }}>
                    <source src="video/sample.mp4" type="video/mp4" />
                </video>

                {/* 🎨 썸네일 캡처용 canvas (숨김) */}
                <canvas ref={canvasRef} width={160} height={90} style={{ display: "none" }} />
            </div>
        </div>
    );
};

// 스타일
const styles = {
    container: { textAlign: "center", marginTop: "20px" },
    videoWrapper: {
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        overflow: "hidden",
    },
    video: { display: "block", borderRadius: "10px" },
    playButton: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 0, 0, 0.6)", 
        borderRadius: "50%",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    controlButton: {
        position: "absolute",
        bottom: 13,
        left: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px",
    },
    noClickZone: {
        position: "absolute",
        bottom: 10,
        right: "0",
        width: "91%",
        height: "40px",
        display: "flex",
        alignItems: "center",
    },
    noClickZone2: {
        position: "relative",
        bottom: 55,
        right: "0",
        width: "100%",
        height: "10",
        display: "flex",
        alignItems: "center",
    },
    volumeWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    volumeButton: {
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px",
        
    },
    volumeSlider: {
        width: "60px",
        height: "4px", 
        cursor: "pointer",
        appearance: "none",
        background: "white",
        borderRadius: "5px",
        outline: "none",
        position: "absolute",
        left: "30px",
        top: "10px",
    },
    progressBar: {
        left: "calc(1.5%)",
        width: "97%",
        height: 5,
        background: "rgba(255, 255, 255, 0.3)",
        position: "relative",
        cursor: "pointer",
    }
};

export default Video;
