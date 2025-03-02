import React, { useRef, useState, useEffect } from "react";

const Video = () => {
    const videoRef = useRef(null);
    const hiddenVideoRef = useRef(null);
    const canvasRef = useRef(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [previewPos, setPreviewPos] = useState({ left: 0, visible: false });
    const [lastRequestedTime, setLastRequestedTime] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        const hiddenVideo = hiddenVideoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!video || !hiddenVideo || !canvas) return;

        const handleSeeked = () => {
            if (hiddenVideo.readyState >= 2) {
                ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL("image/png"));
            }
        };

        const handleMouseMove = (e) => {
            const rect = video.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;

            // 🎯 마우스가 재생 바 위에 있을 때만 미리보기 표시
            if (e.clientY < rect.bottom - 40) {
                setPreviewPos((prev) => ({ ...prev, visible: false }));
                return;
            }

            let progress = offsetX / rect.width;
            progress = Math.min(Math.max(0, progress), 1);
            const previewTime = hiddenVideo.duration * progress;

            // 불필요한 요청 방지
            if (lastRequestedTime !== previewTime) {
                setLastRequestedTime(previewTime);
                hiddenVideo.currentTime = previewTime;
            }

            // 🎯 X값은 마우스를 따라가고, Y값은 고정
            setPreviewPos({ 
                left: offsetX, 
                visible: true 
            });
        };

        const handleMouseLeave = () => {
            setPreviewPos((prev) => ({ ...prev, visible: false }));
        };

        hiddenVideo.addEventListener("seeked", handleSeeked);
        video.addEventListener("mousemove", handleMouseMove);
        video.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            hiddenVideo.removeEventListener("seeked", handleSeeked);
            video.removeEventListener("mousemove", handleMouseMove);
            video.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [lastRequestedTime]);

    return (
        <div 
            style={{ 
                width: "100%", 
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 auto",
            }}
        >
            <video 
                ref={videoRef} 
                controls
                style={{
                    width: "90%",
                    maxWidth: "800px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginTop: "20px",
                }}
            >
                <source src="/video/test.mp4" type="video/mp4" />
                당신의 브라우저는 비디오 태그를 지원하지 않습니다.
            </video>

            <h2 style={{ 
                alignSelf: "flex-start",
                marginTop: "10px", 
                marginLeft: "5%",
                textAlign: "left" 
            }}>
                제목
            </h2>

            {previewPos.visible && thumbnail && videoRef.current && (
                <img
                    src={thumbnail}
                    alt="미리보기"
                    style={{
                        position: "absolute",
                        bottom: "50px", // 🎯 Y값 고정 (비디오 컨트롤 바 위)
                        left: `${previewPos.left}px`, 
                        transform: "translateX(-50%)", // 정중앙 정렬
                        width: 120,
                        height: 70,
                        border: "2px solid #fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                        background: "#000",
                        pointerEvents: "none"
                    }}
                />
            )}

            <video ref={hiddenVideoRef} width={160} height={90} style={{ display: "none" }}>
                <source src="/video/test.mp4" type="video/mp4" />
            </video>

            <canvas ref={canvasRef} width={160} height={90} style={{ display: "none" }} />
        </div>
    );
};

export default Video;
