"use client"

import React, {useState} from 'react';

function ImageClickFull({src}) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <div className={`select-none ${isFullScreen ? 'w-screen h-screen fixed top-0 left-0 bg-black p-1' : 'inline-block ml-1 mt-1 w-32 h-32 md:w-52 md:h-52 lg:w-64 lg:h-64 border border-solid border-gray-200 overflow-hidden'}`}
             onClick={toggleFullScreen}>
            <div className={`w-full h-full flex items-center`} >
                <img src={src}
                     className={`${isFullScreen ? 'w-max h-max object-contain mx-auto' : 'w-max h-max object-cover'}`}
                     alt=""
                     loading="lazy"/>
            </div>
        </div>
    );
}

export default ImageClickFull;