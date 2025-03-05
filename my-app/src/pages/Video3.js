import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const Video = () => {
    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null);
    const canvasRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showVolumeBar, setShowVolumeBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [thumbnail, setThumbnail] = useState(null); // For preview thumbnail
    const [previewPos, setPreviewPos] = useState({ left: 0, visible: false }); // For preview position

    let volumeTimeout = null;

    // Handle video play / pause
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

    // Show play/pause icon and fade out
    const showIconWithFadeOut = () => {
        setShowIcon(true);
        setFadeOut(false);
        setTimeout(() => setFadeOut(true), 100);
        setTimeout(() => setShowIcon(false), 300);
    };

    // Handle mute
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

    // Handle volume change
    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    // Handle progress update
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percentage);
        }
    };

    // Handle mouse events for progress bar preview
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

            // Update hidden video current time for preview
            hiddenVideo.currentTime = previewTime;

            // Capture frame and set thumbnail
            const updateThumbnail = () => {
                ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL("image/png"));
                setPreviewPos({ left: offsetX, visible: true });

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

    return (
        <div style={styles.container}>
            <div style={styles.videoWrapper} onClick={togglePlay}>
                <video ref={videoRef} width={600} style={styles.video} onTimeUpdate={handleTimeUpdate}>
                    <source src="video/sample.mp4" type="video/mp4" />
                    당신의 브라우저는 비디오 태그를 지원하지 않습니다.
                </video>

                {/* Progress bar */}
                <div
                    ref={progressBarRef}
                    style={styles.progressBar}
                    onClick={(event) => {
                        if (videoRef.current) {
                            const rect = event.target.getBoundingClientRect();
                            const offsetX = event.clientX - rect.left;
                            const newTime = (offsetX / rect.width) * videoRef.current.duration;
                            videoRef.current.currentTime = newTime;
                        }
                    }}
                >
                    <div style={{ ...styles.progress, width: `${progress}%` }} />
                </div>

                {/* Thumbnail preview */}
                {previewPos.visible && (
                    <img
                        src={thumbnail}
                        alt="Preview"
                        style={{
                            position: "absolute",
                            bottom: 30,
                            left: previewPos.left,
                            width: 100,
                            height: 60,
                            transform: "translateX(-50%)",
                            border: "2px solid #fff",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                            background: "#000",
                        }}
                    />
                )}

                {/* Play/Pause Button */}
                {showIcon && (
                    <div
                        style={{
                            ...styles.playButton,
                            opacity: fadeOut ? 0 : 1,
                            transition: "opacity 0.5s ease-in-out",
                        }}
                    >
                        {isPlaying ? <FaPause size={20} color="white" /> : <FaPlay size={20} color="white" />}
                    </div>
                )}

                {/* Volume control */}
                <div className="no-click" style={styles.noClickZone}>
                    <div style={styles.volumeWrapper}>
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
            </div>

            {/* Hidden video for thumbnail preview */}
            <video ref={hiddenVideoRef} width={160} height={90} style={{ display: "none" }}>
                <source src="video/sample.mp4" type="video/mp4" />
            </video>

            {/* Hidden canvas for capturing frames */}
            <canvas ref={canvasRef} width={160} height={90} style={{ display: "none" }} />
        </div>
    );
};

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
    progressBar: {
        position: "absolute",
        bottom: "45px",
        left: "calc(1.5%)",
        width: "97%",
        height: "5px",
        background: "rgba(255, 255, 255, 0.3)",
        cursor: "pointer",
    },
    progress: {
        height: "100%",
        background: "white",
    },
    noClickZone: {
        position: "absolute",
        bottom: "0",
        right: "0",
        width: "91%",
        height: "40px",
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
};

export default Video;
