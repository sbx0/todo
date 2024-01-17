"use client"

import React, {useEffect, useState} from 'react';
import {getCookie} from "../../../../apis/cookies";
import {callApi} from "../../../../apis/request";
import {FileList, GET, POST} from "../../../../apis/apiPath";
import ImageClickFull from "../image/image";

function DragAndDropUpload() {
    const [files, setFiles] = useState([])
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        getFileList();
    }, []);

    const getFileList = () => {
        callApi({
            method: GET,
            url: FileList,
        }).then(r => {
            setFiles(r.data)
        })
    }

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
                    let file = json.data.name;
                    newFiles.push({name: file});
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
        <div className="w-full h-full"
             onDragEnter={handleDragEnter}
             onDragLeave={handleDragLeave}
             onDragOver={handleDragOver}
             onDrop={handleDrop}
             onPaste={handlePaste}>
            <div className="flex flex-wrap justify-center">
                {
                    files.map((one => <ImageClickFull key={one.name} src={'/api/file/download/' + one.name}/>))
                }
            </div>
        </div>
    );
}

export default DragAndDropUpload;