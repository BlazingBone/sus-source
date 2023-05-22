import userAtom from '@/atom/userAtom';
import { auth } from '@/firebase/firebase';
import friendsHook from '@/hooks/friendsHook';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

type SupportSettingsProps = {
    
};

const SupportSettings:React.FC<SupportSettingsProps> = () => {
    
    const [userAuth, loading] = useAuthState(auth);
    const user = useRecoilValue(userAtom);
    const [question, setQuestion] = useState("");
    const [reevaluation, setReevaluation] = useState("");
    const [username, setUsername] = useState("");
    const [someoneWantedBanned, setSomeoneWantedBanned] = useState("");
    const router = useRouter();

    const {submitReport} = friendsHook();

    useEffect(() => {
        if(!userAuth && loading == false){
            router.push("/login");
        }
    }, [])

    const submitSupportMessage = () => {
        if(userAuth){
            submitReport(question, reevaluation, username, someoneWantedBanned, user.username, userAuth?.uid);
            setQuestion("");
            setReevaluation("");
            setUsername("");
            setSomeoneWantedBanned("");
        }
    }

    return (
        <>
            <div className="relative inline-block p-5 bg-white dark:bg-[#181818] w-full">
                <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                    <span className="font-mono">Support</span>
                </div>              
                    <div className="w-[300px] md:w-[600px] m-auto bg-slate-300 dark:bg-[#201e1e] p-5 rounded-xl ">
                        <div className="mb-2 pl-1">
                            <span className="text-gray-500 dark:text-white">Do have any questions?</span>
                        </div>
                        <input value={question} onChange={(e) => setQuestion(e.target.value)} className="bg-gray w-full p-2 rounded-md shadow-lg mb-16" type="text" placeholder="Problems, bugs or questions? Write us!" />
                        <div className="mb-2 pl-1">
                            <span className="text-gray-500 dark:text-white">Did you recieve a strike that is unjust in your opinion? Ask for a reevaluation.</span>
                        </div>
                        <input value={reevaluation} onChange={(e) => setReevaluation(e.target.value)} className="bg-gray w-full p-2 rounded-md shadow-lg mb-16" type="text" placeholder="I dont think that ...blabla... this is why ...blabla... like that etc pp." />
                        <div className="mb-2 pl-1">
                            <span className="text-gray-500 dark:text-white">Do you want to someone that is not getting banned for some reason?</span>
                        </div>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray w-3/6 p-2 rounded-md shadow-lg mb-2" type="username" placeholder="Username" />
                        <input value={someoneWantedBanned} onChange={(e) => setSomeoneWantedBanned(e.target.value)} className="bg-gray w-full p-2 rounded-md shadow-lg mb-16" type="text" placeholder="Why should this person be banned or striked?" />
                        <div className="flex w-full justify-end">
                            <button onClick={submitSupportMessage} className="w-40 h-10 border-2 border-gray-500 hover:bg-green-600 rounded-xl shadow-md"> {/*<!--Zum Admin senden-->*/}
                                <svg className="w-6 h-6 -ml-1 pb-1 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>                      
                                <span className="inline-block">Send to Admin</span>
                            </button>
                        </div>
                    </div>
            </div>
        </>
    )
}
export default SupportSettings;