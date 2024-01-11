"use client"

import React, {useState} from 'react';

function ImageClickFull({src}) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <div className={`${isFullScreen ? 'w-screen h-screen fixed top-0 left-0 bg-black' : ''}`}
             onClick={toggleFullScreen}>
            <img src={src}
                className={`${isFullScreen ? 'w-full h-full object-contain mx-auto' : ''}`}
                alt=""
                loading="lazy"
            />
        </div>
    );
}

export default ImageClickFull;