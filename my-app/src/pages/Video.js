import React from "react";

const Video = () => {
    return (
        <>
            <h2>비디오 제목</h2>
            <video width={450} controls>
                <source src="/video/Mice_on_Venus.mp4" type="video/mp4"/>
                당신의 브라우저는 비디오 태그를 지원하지 않습니다.
            </video>
        </>
    );
}

export default Video;