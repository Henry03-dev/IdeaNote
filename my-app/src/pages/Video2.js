import React, { useRef, useState, useEffect } from "react";

const Video2 = () => {
    const videoRef = useRef(null); // 실제 재생되는 비디오
    const hiddenVideoRef = useRef(null); // 프레임 캡처용 숨겨진 비디오
    const canvasRef = useRef(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [previewPos, setPreviewPos] = useState({ left: 0, visible: false });

    useEffect(() => {
        const video = videoRef.current;
        const hiddenVideo = hiddenVideoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let animationFrameId = null;

        const handleMouseMove = (e) => {
            if (!video || !hiddenVideo) return;

            const rect = video.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            // 🎯 비디오 컨트롤(재생 바) 위에 있을 때만 미리보기 표시
            if (offsetY < rect.height - 40) {  // 대략 컨트롤 바 높이 (40px)
                setPreviewPos((prev) => ({ ...prev, visible: false }));
                return;
            }

            const progress = offsetX / rect.width;
            const previewTime = hiddenVideo.duration * progress;

            // 숨겨진 비디오 특정 시간으로 이동
            hiddenVideo.currentTime = previewTime;

            // 프레임을 실시간으로 캡처
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

        // 이벤트 리스너 등록
        if (video) {
            video.addEventListener("mousemove", handleMouseMove);
            video.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (video) {
                video.removeEventListener("mousemove", handleMouseMove);
                video.removeEventListener("mouseleave", handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{ width: 500, position: "relative" }}>
            <h2>비디오 미리보기 기능</h2>
            
            {/* 실제 비디오 (소리 포함) */}
            <video ref={videoRef} width={500} controls>
                <source src="/video/test.mp4" type="video/mp4" />
                당신의 브라우저는 비디오 태그를 지원하지 않습니다.
            </video>

            {/* 썸네일 미리보기 */}
            {previewPos.visible && (
                <img
                    src={thumbnail}
                    alt="미리보기"
                    style={{
                        position: "absolute",
                        bottom: 60, // 비디오 컨트롤 위로 배치
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

            {/* 숨겨진 비디오 (프레임 캡처 전용) */}
            <video ref={hiddenVideoRef} width={160} height={90} style={{ display: "none" }}>
                <source src="/video/test.mp4" type="video/mp4" />
            </video>

            {/* 썸네일 캡처용 canvas (숨김) */}
            <canvas ref={canvasRef} width={160} height={90} style={{ display: "none" }} />
        </div>
    );
};

export default Video2;
