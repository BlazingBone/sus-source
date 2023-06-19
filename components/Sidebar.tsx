import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import {useSetRecoilState} from "recoil";
import userAtom, { initialState } from '@/atom/userAtom';
import { useRouter } from 'next/router';
import userHook from '@/hooks/userHook';
import { useAuthState } from 'react-firebase-hooks/auth';

type SidebarProps = {
    setOpenSidebar : any;
};

const Sidebar:React.FC<SidebarProps> = ({setOpenSidebar}) => {
    
    const [userAuth] = useAuthState(auth);
    const setUser = useSetRecoilState(userAtom);
    const router = useRouter();
    const [logoutComplete, setLogoutComplete] = useState(false);
    const {onLogoutUpdate} = userHook();

    const logout = () => {
        if(userAuth){
            onLogoutUpdate(userAuth?.uid);
            setLogoutComplete(true);
        }
    }

    useEffect(() => {
        if(logoutComplete && userAuth?.uid){
            signOut(auth);
            setUser(initialState);
            setOpenSidebar(false);
            router.push("/login");
        }
    }, [logoutComplete])

    return (
        <div className="inset-0 z-10">
            <div className="md:w-80 relative h-screen bg-white pt-5 dark:bg-[#181818]"> {/*<!--Hamburger Menü noch einfügen!!!!-->*/}
                <div className="flex justify-center border-b-2 dark:border-b-zinc-800">
                <img className="h-20 mb-5" src="/images/Logo/SUS_final.png" alt="" /> 
                </div>
                <nav>
                    <Link href="/home" onClick={() => setOpenSidebar((prevValue : boolean) => !prevValue)}>
                        <div className="h-10 w-full mt-5 pl-5 pt-2 border-l-8 dark:border-l-zinc-800 hover:border-blue-300 dark:hover:border-blue-300 hover:pl-8">Home</div>
                    </Link>
                    <Link href={`/account/${userAuth?.uid}`} onClick={() => setOpenSidebar((prevValue : boolean) => !prevValue)}>
                        <div className="h-10 w-full mt-5 pt-2 pl-5 border-l-8 dark:border-l-zinc-800 hover:border-blue-300 dark:hover:border-blue-300 hover:pl-8 ">Profile</div>
                    </Link>
                    <Link href="/settings?setting=About" onClick={() => setOpenSidebar((prevValue : boolean) => !prevValue)}>
                        <div className="h-10 w-full mt-5 pt-2 pl-5 border-l-8 dark:border-l-zinc-800 hover:border-blue-300 dark:hover:border-blue-300 hover:pl-8 ">About</div>
                    </Link>
                    <Link href="/settings" onClick={() => setOpenSidebar((prevValue : boolean) => !prevValue)}>
                        <div className="h-10 w-full mt-5 pt-2 pl-5 border-l-8 dark:border-l-zinc-800 hover:border-blue-300 dark:hover:border-blue-300 hover:pl-8 ">Settings</div>
                    </Link>
                    <Link href="https://www.youtube.com/watch?v=xvFZjo5PgG0" onClick={() => setOpenSidebar((prevValue : boolean) => !prevValue)}>
                        <div className="h-10 w-full mt-5 pt-2 pl-5 border-l-8 dark:border-l-zinc-800 hover:border-blue-300 dark:hover:border-blue-300 hover:pl-8 ">?</div>
                    </Link>
                    
                </nav>

                <div className="absolute flex w-full h-[50px] bottom-2 items-center justify-center">
                    <button onClick={logout} className='bg-gray-100 dark:bg-[#121212] dark:border-gray-200 dark:border-2 dark:hover:bg-blue-600 transition-all duration-300 hover:bg-gray-300 rounded-full w-[250px] h-[50px] hover:border-blue-300'>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;