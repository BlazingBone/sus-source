import { auth } from '@/firebase/firebase';
import userHook from '@/hooks/userHook';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import {useRecoilValue} from "recoil";
import Link from 'next/link';
import userAtom from '@/atom/userAtom';
import Imagechange from '@/components/Imagechange';
import Post from '@/components/Post';
import postHook from '@/hooks/postHook';
import postAtom from '@/atom/postAtom';
import Loader from '@/components/Loader';
import Image from 'next/image';

type AccountProps = {
    
};

const Account:React.FC<AccountProps> = () => {


    const [userAuth, loading, error] = useAuthState(auth);
    const user = useRecoilValue(userAtom);
    const post = useRecoilValue(postAtom);
    const router = useRouter();

    const {getUserInformation, updateUserInformationWithCountryAndAge} = userHook();
    const {getPostsByUserId} = postHook();
    const {id} = router.query;

    const [editMode, setEditMode] = useState(false);
    const [imageChange , setImageChange] = useState(false);
    const [age, setAge] = useState(user.age);
    const [country, setCountry] = useState(user.country);

    useEffect(() => {
        if(!userAuth?.uid && loading === false){
            router.push("/login")
        } else {
            if(typeof id == "string" ){
                getUserInformation(id);
            }
        }
    }, [userAuth, id]);

    useEffect(() => {
        if(typeof id == "string" && id){
            getPostsByUserId(id);
        }
    }, [id])

    const saveChanges = () => {
        if(typeof id == "string")
        {
            updateUserInformationWithCountryAndAge(id, country, age);
        }
    }

    return (
    <div className='bg-neutral-300 dark:bg-[#121212]'>
        <img className="fixed inset-0 md:object-cover " src="/images/forest-g4f76565d6_1920.jpg" alt="" />
        <div className="flex relative md:w-auto md:h-auto h-full w-full opacity-90">
            <div className="lg:w-80 lg:h-screen bg-transparent lg:inline-block w-0 h-0"></div>
            <div className="inline-block flex-1 border-l-2 border-r-2 border-opacity-10 border-black bg-slate-500 dark:bg-[#121212]">
                <div className=" flex h-52 w-full bg-neutral-300 dark:bg-[#121212]">
                    <div className="inline-block w-full mr-5 bg-neutral-300 dark:bg-[#121212]">
                        <div className="flex">
                            <Link href="/home">
                                <svg className=" w-6 h-6 ml-5 mt-2 -mb-2 opacity-50 rounded-full hover:shadow-md hover:bg-neutral-200 active:bg-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </Link>
                        </div>
                        <div className="px-7">
                                <span className="text-gray-500 dark:text-white inline-block w-4/5 h-8 p-2 mb-2 mt-3 rounded-xl font-semibold">{user.username}</span>{/*<!--Username-->*/}
                        </div>
                        <div className="px-7">
                            <span className="text-gray-500 dark:text-white inline-block w-4/5 h-8 p-2 mb-2 mt-3 rounded-xl font-semibold">{user.email}</span>{/*<!--Email-->*/}
                        </div>
                            {editMode ? (
                            <div className="flex pl-2 ml-6">
                                <input value={age} onChange={(e) => setAge(e.target.value)} className="text-gray-500 dark:text-white inline-block w-2/5 h-8 p-2 mb-2 mt-3 rounded-xl font-semibold" placeholder='Enter Age here...' />
                                <input value={country} onChange={(e) => setCountry(e.target.value)} className="text-gray-500 dark:text-white inline-block w-2/5 h-8 p-2 mb-2 mt-3 rounded-xl font-semibold ml-2" placeholder='Enter Country here...' />
                            </div>
                            ) : (
                            <div className="flex pl-2">
                                <span className="text-gray-500 dark:text-white inline-block w-2/5 h-8 p-2 mb-2 mt-3 ml-5 rounded-xl font-semibold">{user.country ? user.country : "[COUNTRY HERE]"}</span>{/*<!--Country-->*/}
                                <span className="text-gray-500 dark:text-white inline-block w-1/5 h-8 p-2 mb-2 mt-3 rounded-xl font-semibold">{user.age ? user.age : "[AGE HERE]"}</span>{/*<!--Age-->*/}
                            </div>
                            )}
                        <div className="flex justify-end items-center">
                            {editMode && (
                                <button onClick={saveChanges} className=' bg-gray-100 rounded-full dark:bg-[#121212] hover:bg-neutral-200 p-1 z-10'>
                                    Save Changes
                                </button>
                            )}
                            <button className="z-10 w-8 mt-3 bg-gray-100 dark:bg-[#222222] mb-[10px] ml-2 justify-center items-center flex h-8 pl-1 rounded-full hover:shadow-md hover:bg-neutral-200 active:bg-neutral-300" onClick={() => userAuth?.uid === id && setEditMode(prevValue => !prevValue)}> {/*<!--Befehl Profilbild ändern-->*/}
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                    </svg>
                            </button>
                        </div>

                    </div>
                    <div className="inline-block h-full mr-5 w-64 justify-end relative dark:bg-[#121212]">
                        <img className="h-44 w-44 relative mt-16 border-solid border-8 rounded-full object-cover  dark:border-[#222222] border-opacity" src={user.profileImgUrl ? user.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} alt="" />
                        {userAuth?.uid === id && (
                            <PlusIcon onClick={() => setImageChange(prevValue => !prevValue)} className='bg-transparent top-16 border-8 hover:border-white dark:hover:border-[#222222] cursor-pointer absolute text-transparent h-44 w-44 rounded-full bg-opacity-75 hover:bg-neutral-300 dark:hover:bg-[#121212] hover:text-gray-200 dark:hover:text-white transition-all ease-in-out duration-300' />
                        )}
                    </div>
                </div>

                <div className="p-5 flex flex-col overflow-y-scroll h-auto md:max-h-[76vh] scrollbar-hide">   
                        {post.posts.map((post) => (
                            <Post key={post.postId} post={post} />
                        ))}
                </div>
            </div>
            <div className="lg:w-80 lg:h-screen bg-transparent lg:inline-block w-0 h-0"></div>  
        </div>
        {imageChange && (
            <div className='fixed z-[999] inset-0 flex items-center justify-center '>
                <Imagechange profileImgUrl={user.profileImgUrl} setImageChange={setImageChange} />
            </div>
        )}
    </div>
    )
}
export default Account;