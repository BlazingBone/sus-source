import React from 'react';

type GuidelineSettingsProps = {
    
};

const GuidelineSettings:React.FC<GuidelineSettingsProps> = () => {
    
    return (
        <>
            <div className="inline-block relative">
                <div className="w-full h-screen">
                    <div className="w-[400px] lg:w-[800px] m-auto bg-gray-400 dark:bg-[#121212] rounded-lg p-10">
                        <span>Mit der Benutzung dieser Website willigen Sie den Benutzerbedingungen ein, welche sich auf die folgenden Aspekte und Regeln zusammensetzt:</span>
                        <ul>
                            <li>Die Betreiber dürfen Daten der Benutzer speichern und zur optimierung der Website verwenden</li>
                            <li>Die Daten der Nutzer werden nicht an Dritte weitergegeben oder verkauft</li>
                            <li>Der Nutzer hat das Recht die gesamte Löschung seiner Daten zu beantragen</li>
                            <li>Meinung ist sehr subjektiv und individuel, weshalb die Regulierung dieser außerordentlich schwierig ist. Das bannen geschieht so objektiv wie möglich, kann aber fehlerhaft sein. Dies bitten wir zu beachten.</li>
                            <li>Alle Posts werden von einem Algorithmus auf Stichworte durchlaufen und sperren diese automatisch</li>
                            <li>Die Admins haben das volle Recht User zu bannen. Dies geschiet nach den Bewertungskriterien.</li>
                            <li>Sollte ein User einen Strike als ungerecht erachten, hat er das Recht eine Revaluation zu beantragen. Die Rücknahme des Strikes obliegt jedoch den Bewertungskriterien und der Einschätzung eines Admin</li>
                            <li>Sollte ein User gebannt werden, wird dieser durch einen IP-Bann vollzogen. Dies erlaubt es den User nicht mehr sich an seinem Gerät anzumelden, egal mit welcher E-Mail.</li>
                            <li></li>
                        </ul>   
                    </div>
                </div>
            </div>
        </>
    )
}
export default GuidelineSettings;