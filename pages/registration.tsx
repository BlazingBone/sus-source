import React, {useEffect, useState } from 'react';
import {createUserWithEmailAndPassword} from "firebase/auth";
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import {useRecoilState} from "recoil";
import {useAuthState} from "react-firebase-hooks/auth";
import { useRouter } from 'next/router';
import {auth, db} from "../firebase/firebase";
import userAtom from '@/atom/userAtom';
import Link from 'next/link';

type registrationProps = {
    
};

const Registration:React.FC<registrationProps> = () => {
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if(user){
            router.push("/home");
        }
    }, [user])

    const register = async () => {
        setIsLoading(true);
        if(email && password){
            const userAuthData = await createUserWithEmailAndPassword(auth, email, password);

            const docData = {
                username,
                email,
                age: "",
                country: "",
                role : "User",
                profileImgUrl: "",
                lastLogIn: "Online",
                posts: [],
                friends: [],
                post_delete_span: "3 Tage",
                comments: [],
                likes: [],
                dislikes: [],
                strikes: [],
                nitroExpireDate: ""
            };
            await setDoc(doc(db, "users", userAuthData.user.uid), docData);
            router.push("/home");
        }
    }

    return (
        <div className='h-[88vh]'>
            {/* <img className="absolute -mt-28 w-full h-full object-cover" src="/Projektarbeit/Log-In/Background/Berge.mp4" alt="" /> {/*<!--Hintergrundfarbe ändern-->*/}
            <div className="relative w-96 rounded p-5 m-auto pt-5 bg-white dark:bg-[#222222] mt-28">
                <div className="">
                    <img className="w-60 m-auto" src="/images/Logo/SUS-Logo.jpg" alt="" />
                </div>
                <div className="mt-5 mb-1 flex font-medium justify-center underline hover:cursor-default text-gray-500">
                    <span>Registration</span> 
                </div>
                <div>
                    <div className="font-medium hover:cursor-default text-neutral-500 mb-1 dark:text-white">Prefered Username</div>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-md mb-5 w-full px-2 py-1 border-2 dark:border-none" type="text" placeholder="SusyBaka420" />
                    <div className="font-medium hover:cursor-default text-neutral-500 mb-1 dark:text-white">Email</div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md mb-5 w-full px-2 py-1 border-2 dark:border-none" type="email" placeholder="SUS@gmail.com" />
                    <div className="font-medium hover:cursor-default text-neutral-500 mb-1 dark:text-white">Password</div>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md mb-7 w-full px-2 py-1 border-2 dark:border-none" type="password" placeholder="WhoAsked3,14159265" />
                </div>
                <p className=''>Already have an Account?<Link className='ml-2 underline' href="/login">Login</Link></p>
                <div onClick={register} className="justify-end flex mb-3">
                    <button className="flex w-20 h-8 rounded-lg justify-center bg-slate-200 dark:bg-[#333333]"> {/*<!--User kommt auf die Homepage nachdem die legitimität überprüft wurde-->*/}
                        <span className="mt-1">{isLoading ? "...Loading" : "Enter"}</span> 
                        <svg className="w-6 h-6 mt-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="font-medium text-xs"></div>
                </div>
            </div>
        </div>
    )
}
export default Registration;