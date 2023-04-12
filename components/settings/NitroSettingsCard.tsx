import React, { useEffect, useRef, useState } from 'react';
import {useTheme} from "next-themes";
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import userAtom from '@/atom/userAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import userHook from '@/hooks/userHook';

type NitroSettingsCardProps = {
    
};

const NitroSettingsCard:React.FC<NitroSettingsCardProps> = () => {
    
    const [userAuth] = useAuthState(auth);
    const {theme, setTheme} = useTheme(); 
    const [user, setUser] = useRecoilState(userAtom);
    const inputRef = useRef<HTMLInputElement>(null);
    const {uploadProfilePicAndUpdate} = userHook();
    const [files, setFiles] = useState("");

    useEffect(() => {
        setFiles(user.profileImgUrl);
    }, [user]);

    const uploadGif = (file : File | undefined) => {
        if(typeof userAuth?.uid == "string"){
            uploadProfilePicAndUpdate(userAuth.uid, file, setFiles);
        }
    }

    return (
    <div className="relative inline-block w-full h-screen px-5 pt-5">
        <div className="">
            <div className="w-[300px] md:w-[600px] m-auto mt-32 flex justify-center rounded-2xl py-10 bg-white dark:bg-[#121212]">
                <div className="md:justify-center w-[300px] md:w-auto flex flex-col items-center">
                    <img className="w-30 md:w-96 m-auto mb-5 " src="images/Logo/NITRO.png" alt="" />
                    <p className='text-xl font-bold mb-2'>Color Sets</p>
                    <div className='bg-slate-300 w-[300px] md:w-auto rounded-2xl p-3 flex '>
                       <div onClick={() => setTheme("red")} className={`w-12 h-12 bg-red-400 rounded-full mx-1 md:mx-3 cursor-pointer ${theme === "red" && "border-2 border-white"}`} />
                        <div onClick={() => setTheme("emerald")} className={`w-12 h-12 bg-emerald-400 rounded-full mx-1 md:mx-3 cursor-pointer ${theme === "emerald" && "border-2 border-white"}`} />
                        <div onClick={() => setTheme("amber")} className={`w-12 h-12 bg-amber-400 rounded-full mx-1 md:mx-3 cursor-pointer ${theme === "amber" && "border-2 border-white"}`} />
                        <div onClick={() => setTheme("teal")} className={`w-12 h-12 bg-teal-400 rounded-full mx-1 md:mx-3 cursor-pointer ${theme === "teal" && "border-2 border-white"}`} />
                        <div onClick={() => setTheme("violet")} className={`w-12 h-12 bg-violet-400 rounded-full mx-1 md:mx-3 cursor-pointer ${theme === "violet" && "border-2 border-white"}`} />
                    </div>
                    <div className='border-b-2 border-b-gray-200 dark:border-b-[#333333] h-[2px] w-[300px] md:w-[600px] mt-2' />
                    <div className='mt-2'>
                        <div className='relative h-44 w-44 rounded-full'>
                            <Image src={files ? files : user.profileImgUrl} fill alt="Your Profile Pic" className='rounded-full' />
                        </div>
                    </div>
                    <input className='hidden' type='file' accept='image/gif' ref={inputRef} onChange={(e : any) => uploadGif(e.target.files[0])} />
                    <button onClick={() => inputRef?.current?.click()} className='w-[300px] h-[50px] bg-slate-300 hover:bg-slate-400 dark:bg-[#222222] rounded-full mt-2 dark:hover:bg-[#333333]'>
                        Upload Gif
                    </button>
                </div>
            </div>             
        </div>
    </div>
    )
}
export default NitroSettingsCard;