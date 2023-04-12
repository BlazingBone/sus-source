import { auth, db } from '@/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {useRecoilState} from "recoil";
import userAtom from '@/atom/userAtom';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import userHook from '@/hooks/userHook';

type loginProps = {
    
};

const Login:React.FC<loginProps> = () => {
    
    const [userAuth] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useRecoilState(userAtom);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {onLoginUpdate} = userHook();

    useEffect(() => {
        if(userAuth){
            router.push("/home")
        }
    }, [user])

    const login = async () => {
        setIsLoading(true)
        const loggedInUser = await signInWithEmailAndPassword(auth ,email, password);
        const docRef = doc(db, "users", email);

        try {    
            await onLoginUpdate(loggedInUser.user.uid).then(() => {
                getDoc(docRef).then((docSnap) => {
                    const docData : any = {
                        ...docSnap.data(),
                        id: docSnap.id
                    };
        
                    setUser(prevValue => ({
                        username: docData.username,
                        email: docData.username,
                        age: docData.age,
                        country: docData.country,
                        role : docData.role,
                        profileImgUrl: docData.profileImgUrl,
                        lastLogIn: "Online",
                        posts: docData.posts,
                        post_delete_span: docData.post_delete_span,
                        friends: docData.friends,
                        comments: docData.comments,
                        likes: docData.likes,
                        dislikes: docData.dislikes,
                        strikes: docData.strikes,
                        nitroExpireDate: docData.nitroExpireDate
                }));
                });
            })
            
        } catch (error : any) {
            console.log(error.message);
        }
    }

    return (
        <div className='object-center h-[88vh]'>
            {/* <img className="absolute -mt-28 w-full h-full object-cover" src="/images/Log-In/Background/Berge.mp4" alt="" /> {/*<!--Hintergrundfarbe ändern-->*/}
            <div className="relative w-96 rounded p-5 m-auto pt-5 bg-white dark:bg-[#222222] mt-28">
                <div className="">
                    <img className="w-60 m-auto" src="/images/Logo/SUS-Logo.jpg" alt="" />
                </div>
                <div className="mt-5 mb-1 flex font-medium justify-center underline hover:cursor-default text-gray-500 dark:text-white">
                    <span>Log In</span> 
                </div>
                <div>
                    <div className="font-medium hover:cursor-default text-neutral-500 mb-1">Email</div>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md mb-5 w-full px-2 py-1 border-2" type="email" placeholder="SUS@gmail.com" />
                    <div className="font-medium hover:cursor-default text-neutral-500 mb-1">Password</div>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md mb-7 w-full px-2 py-1 border-2" type="password" placeholder="WhoAsked3,14159265" />
                </div>
                <div className="justify-end flex mb-3">
                    <button className="flex w-20 h-8 rounded-lg justify-center bg-slate-200 dark:bg-[#333333]"> {/*<!--User kommt auf die Homepage nachdem die legitimität überprüft wurde-->*/}
                        <span className="mt-1" onClick={login}>{isLoading ? "...Loading" : "Enter"}</span> 
                        <svg className="w-6 h-6 mt-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="font-medium text-xs">
                        Are you new here? Then go to {" "}
                        <Link className='text-blue-700 underline' href={"/registration"}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;