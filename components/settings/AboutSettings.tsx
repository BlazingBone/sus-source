import Image from 'next/image';
import React from 'react';

type AboutSettingsProps = {
    
};

const AboutSettings:React.FC<AboutSettingsProps> = () => {
    
    return (
        <>
            <div className='z-[0] h-full w-full items-center p-3 justify-center flex'>
                <div className='bg-white dark:bg-[#222222] items-center flex p-10 flex-col rounded-xl '>
                    <div className=' w-72 h-32 relative'>
                        <Image alt="SUS_final logo" fill src="/images/Logo/SUS_final.png" />
                    </div>
                    <div className='space-y-10 p-3 mt-5'>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-bold'>Über SUS:</h3>
                            <p className='text-lg'>Willkommen bei SUS, einer Social-Media-Website, die sich der Hervorhebung regulatorischer Herausforderungen widmet. Bei SUS geht es nicht nur um das Teilen und Interagieren, es ist auch eine bewusste Reflexion über die Komplexität und Schwierigkeiten, die mit der Überwachung sozialer Medien einhergehen.</p> 
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-bold'>Unsere Motivation:</h3>
                            <p className='text-lg'>SUS wurde gegründet, um eine Plattform zu schaffen, auf der die Bedeutung einer ordnungsgemäßen Überwachung von Social-Media-Inhalten diskutiert und demonstriert werden kann. Wir glauben, dass das Verständnis der Herausforderungen und Grenzen der Regulierung von entscheidender Bedeutung für die Schaffung sicherer und verantwortungsvoller digitaler Räume ist. </p>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-bold'>Schwierigkeit der Regulierung:</h3>
                            <p className='text-lg'>In einer Welt, in der die Nutzung sozialer Medien exponentiell zunimmt, stehen wir vor komplexen Problemen im Zusammenhang mit der Meinungsfreiheit, der Privatsphäre, dem Schutz vor Hassreden und der Verbreitung von Desinformation. Die Regulierung sozialer Medien steht vor der Herausforderung, ein Gleichgewicht zwischen dem Schutz der Nutzer und dem Schutz der Meinungsfreiheit zu finden.</p>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-bold'>Unser Ziel:</h3>
                            <p className='text-lg'>Wir möchten das Bewusstsein für die Schwierigkeiten schärfen, mit denen sowohl Regulierungsbehörden als auch Plattformbetreiber und Benutzer konfrontiert sind. Durch die Kombination verschiedener Perspektiven und Ansichten streben wir danach, eine transparente und konstruktive Debatte zu fördern. Dafür benutzen wir die üblich vertretenen Regulierungsmöglichkeiten und zeigen ihre Schwächen auf. </p>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-2xl font-bold'>Treten Sie SUS bei:</h3>
                            <p className='text-lg'>Treten Sie unserer wachsenden Community bei. Gemeinsam können wir die Bedeutung einer nachhaltigen Social-Media-Regulierung erkunden und die damit verbundenen Herausforderungen verstehen. Beteiligen Sie sich an Diskussionen, teilen Sie Ihre Sichtweise und tragen Sie dazu bei, positive Veränderungen in der digitalen Welt herbeizuführen.</p>
                        </div>
                    </div>
                    <h4 className='text-2xl mt-10 w-full'>Kommen Sie zu SUS und lassen Sie uns gemeinsam die Schwierigkeiten der Regulierung verstehen und Lösungen für den verantwortungsvollen Umgang mit sozialen Medien.</h4>
                </div>
            </div>
        </>
    )
}
export default AboutSettings;