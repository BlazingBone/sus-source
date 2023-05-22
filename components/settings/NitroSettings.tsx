import React, { useEffect } from 'react';
import {loadStripe} from "@stripe/stripe-js";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';

type NitroSettingsProps = {
    
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const NitroSettings:React.FC<NitroSettingsProps> = () => {
    
    const [userAuth] = useAuthState(auth);

    return (
        <>
        <div className="relative inline-block w-full h-screen px-5 pt-5">
        <div className="w-full h-full">
            <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                <span className="font-mono">SUS-Nitro</span>
            </div>
            <div className="w-[300px] md:w-[500px] m-auto mt-32 flex justify-center rounded-2xl py-10 bg-white dark:bg-[#181818]">
                <div className="justify-center">
                    <img className="w-96 m-auto mb-10 " src="/images/Logo/NITRO.png" alt="" />
                    <div className="pl-7 border-b-2 border w-full">Premium Abonement für SUS</div>
                    <ul className="ml-6">
                        <li className="flex mt-3">
                            <svg className="w-6 h-6 mr-1 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Animierte Profilbilder
                        </li>
                        <li className="flex mt-3">
                            <svg className="w-6 h-6 mr-1 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Custom Colors
                        </li>
                        <li className="flex mt-3">
                            <svg className="w-6 h-6 mr-1 rounded-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            NITRO-Banner neben deinem Profil und deinen Posts
                        </li>
                    </ul>
                    <div className="flex w-full justify-center mt-32">
                        <form action='/api/checkout_session' method='POST'>
                            <input type='hidden' value={"price_1MsaX1KWZDrUFZU9kNUAvXgs"} name='priceId' id="priceId" />
                            <button type="submit" role='link' className="dark:bg-zinc-800 h-10 w-32 mt-10 mr-10 bg-slate-200 rounded-2xl shadow-lg border-[1px] border-black hover:opacity-75">
                                1,99€/Month
                            </button>
                        </form>
                        <form action='/api/checkout_session' method='POST'>
                            <input type='hidden' value={"price_1Msaf0KWZDrUFZU9ZqpLtQ6W"} name='priceId' id="priceId" />
                            <button type="submit" role='link' className="dark:bg-zinc-800 h-10 w-32 mt-10 bg-slate-200 rounded-2xl shadow-lg border-[1px] border-black hover:opacity-75">
                                20€/Year
                            </button>
                        </form>                   
                    </div>
                </div>    
            </div>
          </div>
        </div>
        </>
    )
}
export default NitroSettings;