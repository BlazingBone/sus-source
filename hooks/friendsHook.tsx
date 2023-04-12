import userAtom from '@/atom/userAtom';
import { auth, db } from '@/firebase/firebase';
import { UsersIcon } from '@heroicons/react/24/solid';
import { arrayRemove, arrayUnion, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';


const friendsHook = () => {
    
    const [allUsers, setAllUsers] = useState<any>([]);
    const [friendedUsers, setFriendedUsers] = useState<any>([]);
    const [user, setUser] = useRecoilState(userAtom);
    const [userAuth] = useAuthState(auth);

    useEffect(() => {
        getAllUsers();
    }, [user, userAuth]);

    const getAllUsers = async() => {

        const querySnapshot = await getDocs(collection(db, "users"));

        setAllUsers([]);

        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            setAllUsers((prevValue: any) => [
                ...prevValue,
                {
                    ...docData,
                    uid: doc.id,
                }
            ]);
        });
    }

    const setAllFriends = (friends: string[]) => {

        setFriendedUsers((prevValue: any) => [allUsers.filter((user : any) => friends?.includes(user.uid))]);

        return friendedUsers
    }

    const getAllUsersOrdered = (friends: string[], setAllUserFriends: any) => {

        setAllFriends(friends);

        setAllUsers(() => [...friendedUsers, ...allUsers.filter((user: any) => !friends?.includes(user.userId))])
    };

    const followUser = async (uid: string, friendId : string) => {

        try {
            const docRef = doc(db, "users", uid);

            await updateDoc(docRef, {
                friends: arrayUnion(friendId)
            });
    
            setUser(prevValue => ({
                ...prevValue,
                friends: [
                    ...prevValue.friends,
                    friendId
                ]
            }));
    
            console.log("Friend successfully added")
        } catch (error : any) {
            console.log(error.message);
        }
    };

    const unfollowUser = async (uid: string, friendId: string) => {
        try {
            const docRef = doc(db, "users", uid);

            setUser(prevValue => ({
                ...prevValue,
                friends: [
                    ...prevValue.friends.filter(friend => friend !== friendId)
                ]
            }));
    
            await updateDoc(docRef, {
                friends: arrayRemove(friendId)
            });
            console.log("Friend successfully removed")
        } catch (error : any) {
            console.log(error.message);
        }
    };

    const submitReport = async (question: string, reevaluation : string, username : string, someoneWantedBanned : string, user: string, uid: string) => {
        const docRef = doc(db, "userreports", uuidv4())
        
        await setDoc(docRef, {
            question,
            reevaluation,
            username,
            someoneWantedBanned,
            user,
            uid
        });

        console.log("Question report successfully submitted");
    }

    return {getAllUsers, getAllUsersOrdered, allUsers, setAllUsers, followUser, unfollowUser, submitReport};
}
export default friendsHook;