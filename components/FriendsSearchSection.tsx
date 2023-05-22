import React, { useEffect, useState } from 'react';
import FriendProfile from './FriendProfile';
import friendsHook from '@/hooks/friendsHook';
import { useRecoilState } from 'recoil';
import userAtom from '@/atom/userAtom';
import { FireIcon } from '@heroicons/react/24/solid';

type FriendsSearchSectionProps = {
    friends: string[]
};

const FriendsSearchSection:React.FC<FriendsSearchSectionProps> = ({friends}) => {
    
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState<any>([]);
    const {allUsers} = friendsHook();

    useEffect(() => {
        if(search){
            let resultUsers : any = []; 
            allUsers.map((user : any) => {
                if(user.username.includes(search)){
                    resultUsers = [...resultUsers, user ];
                }
            });
            setSearchedUsers(resultUsers);
            console.log(searchedUsers);
        } 
    }, [search]);

    return (
        <>
            <div className="lg:w-full lg:h-10 w-0 h-0">
                <input value={search} onChange={(e : any) => setSearch(e.target.value)} className="lg:w-full lg:h-8 p-2 rounded-xl w-0 h-0" type="text" placeholder="Looking for friends?" /> {/*<!--Freunde Suchleiste-->*/}
            </div>
            {
                search ? (
                searchedUsers.map((profile : any, index: any) => (
                    <FriendProfile key={index} profile={profile} />
                )))
                : (
                allUsers.map((profile : any, index : any) => (
                    <FriendProfile key={index} profile={profile} />
                )))
            }
        </>
    )
}
export default FriendsSearchSection;