"use client"

import React, {useState} from 'react';
import {getCookie} from "../../../../apis/cookies";

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

        // 创建 FormData 对象
        const formData = new FormData();

        // 将每个文件添加到 FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        let token, headers;
        if (typeof document !== 'undefined') {
            token = getCookie('token');
        }
        if (token != null && token.trim() !== '') {
            headers = {
                Authorization: 'Bearer ' + token
            }
        }

        // 使用 fetch 发送文件到服务器
        fetch('/api/file/upload', {
            method: 'POST',
            body: formData,
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                // 处理上传成功的逻辑
                console.log('Upload success:', data);
            })
            .catch(error => {
                // 处理上传失败的逻辑
                console.error('Upload failed:', error);
            });
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