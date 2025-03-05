import React, { useState, useRef } from "react";

const Video = () => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div className="flex flex-col items-center mt-5">
            <div
                className="relative w-[600px] cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <video
                    ref={videoRef}
                    className="w-full rounded-lg shadow-lg"
                    muted
                    loop
                >
                    <source src="video/sample.mp4" type="video/mp4" />
                    당신의 브라우저는 비디오 태그를 지원하지 않습니다.
                </video>
                {!isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-bold">
                        ▶ 미리보기
                    </div>
                )}
            </div>
        </div>
    );
};

export default Video;
