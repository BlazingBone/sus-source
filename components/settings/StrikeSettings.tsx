import userAtom from '@/atom/userAtom';
import postHook from '@/hooks/postHook';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Post from '../Post';

type StrikeSettingsProps = {
    
};

const StrikeSettings:React.FC<StrikeSettingsProps> = () => {
    
    const [user, setUser] = useRecoilState(userAtom);
    const {strikedPosts, fetchStrikesPosts} = postHook();

    useEffect(() => {
        fetchStrikesPosts(user.strikes);
    }, [])

    return (
        <>
            <div className="relative inline-block w-full h-screen px-5 pt-5 bg-white dark:bg-[#181818]">
                <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                    <span className="font-mono">Account Strikes</span>
                </div>
                <div className="flex w-full justify-center mt-32 mb-32">
                    <div className=" flex justify-center pt-3 w-40 h-40 bg-gray-200 dark:bg-[#1f1d1d] text-9xl border-4 border-black">{user.strikes.length}</div> {/*<!--Hier Strikes aufführen-->*/}
    
                </div>
                <div className="border-2 border-black dark:border-white p-2 mt-10 mb-2">
                    <span className="font-normal">This is your current count of strikes. If this count goes to 3, your account is getting banned permanently with no option of recieving it back. This allows us to regulate the users of SUS and take counter actions against unappropriate pehavior on this site. Note that this concept is still in progress and it can accur that
                        you get a strike for an unjust reason or due to a mistake. In this case please head to the support and ask for a reevaluation of your strike.</span>
                </div>

                {strikedPosts.map((strikedPost : any) => (
                    <Post post={strikedPost} key={strikedPost.postId} />
                ))}

            </div>
        </>
    )
}
export default StrikeSettings;