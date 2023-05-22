import { create } from 'domain';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type TopPostCartProps = {
    postMessage : string; 
    postId : string;
    createdBy: string;
    username : string;
    isNitro: boolean
};

const TopPostCart:React.FC<TopPostCartProps> = ({postMessage, postId, createdBy, username, isNitro}) => {
    
    const router = useRouter();

    return (
    <div className="w-full min-h-fit rounded-lg shadow-lg mb-5 bg-white dark:bg-[#222222] px-2 pt-2 text-gray-500 "> {/*<!--Karte-->*/}
        <Link href={`/account/${createdBy}`} className='text-[10px] flex mb-1 text-black dark:text-white text-bold hover:underline'>
        {
            isNitro && (
                <div className="flex items-center -mb-1 ml-2 -mr-2">
                    <img className='h-4' src="/images/Logo/NITRO.png" />
                </div>
            )
        }
        <p className='ml-4'>
            @{username}
        </p>
        </Link>
        <div className='dark:text-white'>
            {postMessage}
        </div>
        <div className="flex justify-center dark:text-white">
        <button onClick={() => router.push(`/post/${postId}`)} className="text-sm"> {/*<!--Zum Post springen-->*/}
                Jump to Post
                <svg className="text-gray-500 ml-9 -mt-2 w-6 h-6 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg> 
            </button>
        </div>
    </div> 
    )
}
export default TopPostCart;