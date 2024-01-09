"use client"

import React, { useState } from 'react';

function DragAndDropUpload() {
    const [dragging, setDragging] = useState(false);

    const handleDragEnter = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);

        const files = event.dataTransfer.files;
        // 处理上传文件的逻辑，例如使用FormData发送到服务器

        console.log('Dropped files:', files);
    };

    return (
        <div
            className={`flex items-center justify-center h-screen bg-gray-100 ${dragging ? 'border-4 border-dashed border-blue-500' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">拖拽上传</h1>
                <p className="text-gray-700 mb-4">
                    拖拽文件到此区域进行上传
                </p>
                <div className="border-2 border-dashed border-gray-400 p-4">
                    {dragging ? '放开以上传文件' : '拖拽文件到此区域'}
                </div>
            </div>
        </div>
    );
}

export default DragAndDropUpload;