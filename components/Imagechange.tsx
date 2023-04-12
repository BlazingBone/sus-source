import userHook from '@/hooks/userHook';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

type ImagechangeProps = {
    profileImgUrl: string;
    setImageChange: any;
};

const Imagechange:React.FC<ImagechangeProps> = ({profileImgUrl, setImageChange}) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<any>(profileImgUrl);
    const router = useRouter();
    const {id} = router.query;

    const {uploadProfilePicAndUpdate} = userHook();

    const uploadImage = async (file : File | undefined) => {
        if(typeof id == "string"){
            uploadProfilePicAndUpdate(id, file, setFiles);
        }
    }

    return (
        <>
            <div className=' bg-white dark:bg-[#121212] items-center justify-center p-5 rounded-lg shadow-md '>
                <div className='w-[200px] h-[200px] relative'>
                    <Image className='rounded-full' alt="Image" fill src={files ?  files : "/images/Profile Picture/Profile Picture.jpg"} />
                </div>
                <input onChange={(e : React.ChangeEvent<HTMLInputElement>) => uploadImage(e.target.files?.[0])} accept='image/jpeg' className='hidden' type='file' ref={inputRef}/>
                <button className='w-full h-[50px] rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222222] dark:hover:bg-[#333333] mt-3' onClick={() => inputRef.current?.click()}>
                    Upload Image
                </button>
                <button className='w-full h-[50px] rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#222222] dark:hover:bg-[#333333] mt-3' onClick={() => setImageChange((prevValue: boolean) => !prevValue)}>
                    Close
                </button>
            </div>
            <div>

            </div>
        </>
    )
}
export default Imagechange;