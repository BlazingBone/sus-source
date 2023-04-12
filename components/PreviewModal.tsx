import React from 'react';
import CameraIcon from "@heroicons/react/24/outline/CameraIcon";

type PreviewModalProps = {
    video: string | null;
    image: string | null;
    createPost: () => void;
    setImage: any;
    setVideo: any;
    message: string;
    setMessage: any;
    error: string;
};

const PreviewModal:React.FC<PreviewModalProps> = ({image, video, createPost, setImage, setVideo, message, setMessage, error}) => {
    
    const closePreviewModal = () => {
        setImage("");
        setVideo("");
    }

    return (
        <div className='absolute inset-0 justify-center items-center flex'>
            <div className='bg-gray-300 dark:bg-[#121212] shadow-md max-w-[1050px] max-h-[650px] w-full h-full flex flex-col justify-center rounded-lg'>
                    {image && (<div className='p-3'>
                        <div className='w-[100%] h-[400px] border-dotted border-2 border-white flex items-center justify-center relative'>
                            {image ? (
                                <img src={image} className='max-w-[100%] max-h-[100%]' />
                            ) : (
                                <CameraIcon className='text-white w-[200px]' />
                            )}
                        </div>
                        <div>
                            <h3>Your Message:</h3>
                            <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-[100%] p-3 h-[40px] mx-auto rounded-full mt-2' placeholder='You sure you wanna send that shit...' />
                        </div>
                        <div className='mt-2'>
                            <h3>Image URL:</h3>
                            <input placeholder='image URL here...' className='w-[100%] p-3 h-[40px] mx-auto rounded-full mt-2' value={image} onChange={(e) => setImage(e.target.value)} />
                        </div>
                    </div>)}
                {video && (
                <div className='p-3'>
                    {video ? (
                        <video className='w-full h-[400px]' controls={true} typeof='video/mp4'>
                            <source src={video} />
                        </video>
                    ) : (
                        <div className='w-[100%] h-[400px] border-dotted border-2 border-white flex items-center justify-center'>
                            <CameraIcon className='text-white w-[200px]' />
                        </div>
                    )}
                    <div>
                        <h3>Your Message:</h3>
                        <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-[100%] p-3 h-[40px] mx-auto rounded-full mt-2' placeholder='You sure you wanna send that shit...' />
                    </div>
                    <div className='mt-2'>
                        <h3>Video URL:</h3>
                        <input placeholder='video URL here...' className='w-[100%] p-3 h-[40px] mx-auto rounded-full mt-2' value={video} onChange={(e) => setVideo(e.target.value)} />
                    </div>
                </div>
                )}
                {
                    error && (
                        <p className="w-full text-center text-red-300">
                            {error}
                        </p>
                    )
                }
                <div className='w-full flex justify-end '>
                    <button onClick={closePreviewModal} className='w-[150px] h-[40px] dark:bg-[#222222] dark:hover:bg-[#333333] hover:bg-gray-200 bg-white rounded-full mr-5'>
                        Close
                    </button>
                    <button onClick={createPost} className='w-[150px] h-[40px] dark:bg-[#222222] dark:hover:bg-[#333333] hover:bg-gray-200 bg-white rounded-full mr-5'>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
export default PreviewModal;