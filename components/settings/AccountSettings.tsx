import { auth } from '@/firebase/firebase';
import userHook from '@/hooks/userHook';
import { User } from '@/types/User';
import React, { useEffect, useState } from 'react';
import { useAuthState, useUpdateEmail } from 'react-firebase-hooks/auth';
import {useTheme} from "next-themes"

type AccountSettingsProps = {
    user : User
};

const AccountSettings:React.FC<AccountSettingsProps> = ({user}) => {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    const [userAuth, loading, error] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [deleteState, setDeleteState] = useState("");
    const [updateEmail, updataing, emailError] = useUpdateEmail(auth);

    const {updateUserCredentials} = userHook();

    useEffect(() => {
        setEmail(user.email);
        setUsername(user.username);
        setDeleteState(user.post_delete_span);
    }, [user]);

    const saveChanges = async () => {
        if((email != user.email) || (username != user.username) || (deleteState != user.post_delete_span)){
            const success = await updateEmail(email);
            if(success){
                console.log("Successfully changed password");
            }
            if(userAuth){
                updateUserCredentials(userAuth?.uid, email, username, deleteState);
            }
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);
    
    if(!mounted) return null;

    return (
        <>
        <div className="relative inline-block w-full h-screen px-5 pt-5 bg-white dark:bg-[#121212]">
            <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                <span className="font-mono">Allgemein</span>
            </div>
            <div>
                <span className="pl-1">Email:</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md mb-5 mt-1 w-full px-2 py-1 border-2" type="email" placeholder="SUS@gmail.com" />{/*<!--Hier Email des Nutzers-->*/}
                <span className="pl-1">Your username:</span>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-md mb-5 mt-1 w-full px-2 py-1 border-2" type="text" placeholder="BigSUS420" />{/*Hier Name des users*/}
            </div>
            <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                <span className="font-mono">Post Einstellungen</span>
            </div>
            <div>
                <span className="mr-5">
                    Post-delete-span*:
                </span>
                <div className="inline-block relative w-64 selection:border-none">
                    <select value={deleteState} onChange={(e) => setDeleteState(e.target.value)} className="rounded-md mb-5 mt-1 w-40 px-2 py-1 border-2">
                    <option>-</option>
                    <option>1 Tag</option>
                    <option>2 Tage</option>
                    <option>3 Tage</option>
                    </select>
                </div>
                <span className="block font-light text-sm mb-5">*Die Post-delete-span beschreibt den Zeitraum bis deine Posts gelöscht werden.</span>
            </div>
            <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                <span className="font-mono">Darkmode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={theme === "dark"} type="checkbox" onChange={() => setTheme(theme === "light" ? "dark" : "light")} value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">Darkmode</span>
            </label>
            <div className="flex justify-end">
                <button onClick={saveChanges} className="w-40 h-10 border-2 border-gray-500 hover:bg-green-600 rounded-xl shadow-md">
                    <svg className="w-6 h-6 -ml-1 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>                      
                    <span className="inline-block">Save Changes</span>
                </button>
            </div>
        </div>
        </>
    )
}
export default AccountSettings;