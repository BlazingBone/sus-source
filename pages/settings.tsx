import userAtom from '@/atom/userAtom';
import AboutSettings from '@/components/settings/AboutSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import GuidelineSettings from '@/components/settings/GuidelineSettings';
import NitroSettings from '@/components/settings/NitroSettings';
import NitroSettingsCard from '@/components/settings/NitroSettingsCard';
import StrikeSettings from '@/components/settings/StrikeSettings';
import SupportSettings from '@/components/settings/SupportSettings';
import { auth } from '@/firebase/firebase';
import userHook from '@/hooks/userHook';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useRecoilState} from "recoil";
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import AdminSettings from '@/components/settings/AdminSettings';

type settingsProps = {
    
};

const Settings:React.FC<settingsProps> = () => {
    
    const [settingsMode, setSettingsMode] = useState("Account");
    const router = useRouter();
    const [userAuth, loading, error] = useAuthState(auth);
    const {getUserInformation, updateUserNitro} = userHook();
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [user, setUser] = useRecoilState(userAtom);
    const [checked, setChecked] = useState(false);
    const {setting} = router.query;

    useEffect(() => {
        if(userAuth?.uid){
            getUserInformation(userAuth.uid);
            setChecked(true);
        }
        else if (!userAuth?.uid && loading === false){
            router.push("/login");
        };
    }, [userAuth]);

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');

            if(query.get("product") === "price_1MsaX1KWZDrUFZU9kNUAvXgs"){
                updateUserNitro(true);

            } else if (query.get("product") === "price_1Msaf0KWZDrUFZU9ZqpLtQ6W"){

                updateUserNitro(false);

            }
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, [checked]);

      useEffect(() => {
        if(router.query.setting){
            setSettingsMode(setting as string);
        }
      }, [])

    return (
        <div className="w-full h-full flex">
            <img className="absolute w-full h-full object-fill" src="/images/rough-horn-g3dfb52a00_1920.jpg" alt=""/>
                <div className="relative w-72 h-screen pl-10 hidden md:inline-block">
                    <div className="pt-5">
                        <div>
                            <img className="h-20 w-[168px] rounded-lg" src="/images/Logo/SUS_final.png" alt="" />
                        </div>
                    </div>
                    <nav className="text-black">
                        <div className="cursor-pointer" onClick={() => setSettingsMode("Account")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Account" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200`}>
                                <span className="mt-1.5 font-mono text-base">
                                Account 
                                </span>
                            </div>
                        </div>

                        <div className="cursor-pointer" onClick={() => setSettingsMode("Strikes")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Strikes" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                <span className="mt-1.5 font-mono text-base">
                                Strikes
                                </span>
                            </div>
                        </div>

                        <div className="cursor-pointer" onClick={() => setSettingsMode("SUS-Nitro")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="SUS-Nitro" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                <span className="mt-1.5 font-mono text-base">
                                SUS-Nitro
                                </span>
                            </div>
                        </div>
                        <div className="cursor-pointer" onClick={() => setSettingsMode("Support")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Support" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                <span className="mt-1.5 font-mono text-base">
                                Support
                                </span>
                            </div>
                        </div>
                        <div className="cursor-pointer" onClick={() => setSettingsMode("About")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="About" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                <span className="mt-1.5 font-mono text-base">
                                About
                                </span>
                            </div>
                        </div>

                        <div className="cursor-pointer" onClick={() => setSettingsMode("Guidelines")}>
                            <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Guidelines" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                <span className="mt-1.5 font-mono text-base">
                                Richtlinien
                                </span>
                            </div>
                        </div>
                        {
                            user.role === "Admin" && (
                            <div className="cursor-pointer" onClick={() => setSettingsMode("Admin")}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Admin" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    Admin Console
                                    </span>
                                </div>
                            </div>
                            )
                        }
                    </nav>
                </div>
                    {settingsMode == "Account" ? (
                        <AccountSettings user={user} />
                    ) : settingsMode == "Strikes" ? (
                        <StrikeSettings />
                    ) : settingsMode == "SUS-Nitro" ? (
                        (user.role === "Nitro" || user.role === "Admin") ? (
                            <NitroSettingsCard />
                        ) : (
                            <NitroSettings />
                        )
                    ) : settingsMode == "Support" ? (
                        <SupportSettings />
                    ) : settingsMode == "About" ? (
                        <AboutSettings />
                    ) : settingsMode == "Guidelines" ? (
                        <GuidelineSettings />
                    ) : settingsMode === "Admin" ? (
                        <AdminSettings />
                    ) : null
                }
                <div className='md:hidden fixed bottom-1 left-1 z-[50] cursor-pointer' onClick={() => setMobileSidebar(prevValue => !prevValue)}>
                    <ArrowRightCircleIcon className='w-8 h-8 dark:text-white text-[#121212]' />
                </div>
                {
                    mobileSidebar && (
                        <nav className="text-black z-[49] fixed inset-0 bg-[#121212] pl-5">
                            <div className="cursor-pointer" onClick={() => {setSettingsMode("Account"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Account" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    Account 
                                    </span>
                                </div>
                            </div>

                            <div className="cursor-pointer" onClick={() => {setSettingsMode("Strikes"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Strikes" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    Strikes
                                    </span>
                                </div>
                            </div>

                            <div className="cursor-pointer" onClick={() => {setSettingsMode("SUS-Nitro"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="SUS-Nitro" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    SUS-Nitro
                                    </span>
                                </div>
                            </div>
                            <div className="cursor-pointer" onClick={() => {setSettingsMode("Support"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Support" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    Support
                                    </span>
                                </div>
                            </div>
                            <div className="cursor-pointer" onClick={() => {setSettingsMode("About"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="About" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    About
                                    </span>
                                </div>
                            </div>

                            <div className="cursor-pointer" onClick={() => {setSettingsMode("Guidelines"); setMobileSidebar(false)}}>
                                <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Guidelines" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                    <span className="mt-1.5 font-mono text-base">
                                    Richtlinien
                                    </span>
                                </div>
                            </div>

                            {
                                user.role === "Admin" && (
                                <div className="cursor-pointer" onClick={() => setSettingsMode("Admin")}>
                                    <div className={`h-10 w-40 transition ease-in hover:opacity-70 delay-150 flex pl-3 mt-10 rounded-r-xl shadow-lg text-lg border-l-8 ${settingsMode=="Admin" ? "border-blue-300" : "hover:border-blue-300"} bg-slate-200 text-gray-500 hover:text-black`}>
                                        <span className="mt-1.5 font-mono text-base">
                                            Admin Console
                                        </span>
                                    </div>
                                </div>
                                )
                            }
                        </nav>
                    )
                }
        </div>
    )
}
export default Settings;