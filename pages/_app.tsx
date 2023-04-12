import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/router';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {

  const [openSidebar, setOpenSidebar] = useState(false);

  const router = useRouter();

  return ( 
  <ThemeProvider themes={["light", "dark", "red", "emerald", "amber", "teal", "violet"]} enableSystem={false} attribute='class'>
    <Head>
      <title>SUS</title>
    </Head>
    <RecoilRoot>
        <Component {...pageProps} />
        { openSidebar && (
        <div className='fixed inset-0'>
          <Sidebar setOpenSidebar={setOpenSidebar} />
        </div>
        )}
        {(router.pathname == "/login" || router.pathname == "/registration") ? (
          <>
          </>
        ) : (
          <div onClick={() => setOpenSidebar(prevValue => !prevValue)} className='cursor-pointer rounded-full fixed bottom-1 right-1 w-10 h-10 bg-white dark:bg-[#121212] border-2 border-black dark:border-white'>
            <div className='flex items-center justify-center h-full w-full'>
              <Bars3Icon />
            </div>
          </div>
        ) }
    </RecoilRoot>
  </ThemeProvider>
  )
}
