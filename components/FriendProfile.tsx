import React from 'react';
import {UserPlusIcon} from "@heroicons/react/24/outline"
import { useRecoilState } from 'recoil';
import userAtom from '@/atom/userAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import friendsHook from '@/hooks/friendsHook';
import { useRouter } from 'next/router';
import moment from 'moment';

type FriendProfileProps = {
    profile: any;
};

const FriendProfile:React.FC<FriendProfileProps> = ({profile}) => {
    
    const [userAuth] = useAuthState(auth);
    const [user, setUser] = useRecoilState(userAtom);
    const {followUser, unfollowUser} = friendsHook();
    const router = useRouter();

    const addFriend = () => {
        if(userAuth){
            followUser(userAuth?.uid, profile.uid);
        }
    }

    const removeFriend = () => {
        if(userAuth){
            unfollowUser(userAuth?.uid, profile.uid);
        }
    }

    return (
    <div onClick={() => router.push(`/account/${profile.uid}`)} className="cursor-pointer lg:w-full lg:h-20 dark:bg-[#222222] bg-white rounded-xl mb-3 lg:flex shadow-xl"> {/*<!--Freundprofil Anfang-->*/}
        <div className="lg:inline-block">
            <img className="w-0 lg:w-24 lg:h-20 lg:object-cover lg:rounded-l-xl" src={profile.profileImgUrl ? profile.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} alt="" /> {/*<!--Freund Profilbild-->*/}
        </div>
        <div className="lg:inline-block lg:w-full w-0 h-0">
            <p className=" lg:font-semibold mt-3 ml-2 ">{profile.username}</p>{/*<!--Name des Freundes hier-->*/}
            <p className=" lg:font-mono text-xs ml-2">
                {profile.lastLogIn === "Online" ? "Online" : (
                    moment(new Date(profile.lastLogIn?.seconds * 1000) ,"YYYYMMDD").fromNow()
                )}
            </p>
            <div className="gl:flex gl:w-full">
                <button className="hover:cursor-pointer ml-44 mt-1"> {/*<!--Freund entfernen-->*/}
                {(profile.uid !== userAuth?.uid) && (
                    user.friends?.includes(profile?.uid) ? (
                        <svg onClick={(e : any) => {e.stopPropagation();removeFriend();}} className="lg:w-5 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>  
                    ) : (
                        <UserPlusIcon onClick={(e : any) => {e.stopPropagation();addFriend();}} className="lg:w-5 w-6 h-6" />
                    )
                )}                                            
                </button>
            </div>
        </div>
    </div> 
    )
}
export default FriendProfile;