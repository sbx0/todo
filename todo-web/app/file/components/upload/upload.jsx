"use client"

import React, {useState} from 'react';
import {getCookie} from "../../../../apis/cookies";

function DragAndDropUpload() {
    const [files, setFiles] = useState([])
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

    const handleUpload = (uploadFiles) => {
        console.log('Dropped files:', uploadFiles);

        const formData = new FormData();
        for (let i = 0; i < uploadFiles.length; i++) {
            formData.append('file', uploadFiles[i]);
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

        fetch('/api/file/upload', {
            method: 'POST',
            body: formData,
            headers: headers
        })
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    let newFiles = files.slice(0);
                    let file = json.data;
                    newFiles.push(file);
                    setFiles(newFiles);
                } else {
                    console.error('Upload failed:', json.message);
                }
            })
            .catch(error => {
                console.error('Upload failed:', error);
            });
    }

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const uploadFiles = event.dataTransfer.files;
        handleUpload(uploadFiles);
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const clipData = event.clipboardData || window.clipboardData;
        const isFiles = !!clipData.files?.length;
        if (isFiles) {
            handleUpload(clipData.files);
        }
    }

    return (
        <div>
            <div
                className={`flex items-center justify-center h-screen bg-gray-100 ${dragging ? 'border-4 border-dashed border-blue-500' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
            >
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-4">拖拽/粘贴上传</h1>
                    <p className="text-gray-700 mb-4">
                        拖拽/粘贴文件到此区域进行上传
                    </p>
                    <div className="border-2 border-dashed border-gray-400 p-4">
                        {dragging ? '放开以上传文件' : '拖拽文件到此区域'}
                    </div>
                </div>
            </div>
            <div className="p-1 gap-1 grid grid-cols-3 grid-rows-1">
                {
                    files.map((one => {
                        return <div key={one.fileName}>
                            <img src={'/api/file/download/' + one.fileName} alt="" loading="lazy"/>
                        </div>;
                    }))
                }
            </div>
        </div>
    );
}

export default DragAndDropUpload;