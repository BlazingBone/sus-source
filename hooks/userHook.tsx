import React from 'react';
import {useRecoilState} from "recoil";
import { auth, db, storage} from "../firebase/firebase";
import { arrayUnion, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import userAtom from '@/atom/userAtom';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from 'react-firebase-hooks/auth';

const userHook = () => {
    const [userAuth, setUserAuth] = useAuthState(auth);
    const [user, setUser] = useRecoilState(userAtom);

    const getUserInformation = async (uid : string ) => {
        
        if(!uid){
            return;
        }
        const docRef = doc(db, "users", uid);

        await getDoc(docRef).then((userInfo) => {
            const data : any = userInfo.data();
            setUser({
                username : data?.username,
                email : data?.email,
                age: data?.age,
                country: data?.country,
                friends: data?.friends,
                role : data?.role,
                profileImgUrl: data?.profileImgUrl,
                lastLogIn: data?.lastLogIn,
                posts: data?.posts,
                post_delete_span: data?.post_delete_span,
                comments: data?.comments,
                likes: data?.likes,
                dislikes: data?.dislikes,
                strikes: data?.strikes,
                nitroExpireDate: data?.nitroExpireDate
            });
        });
    };

    const updateUserInformationWithCountryAndAge = async (id : string, country: string, age: string) => {
        const docRef = doc(db, "users", id);

        await updateDoc(docRef, {
            age,
            country
        });

        await getDoc(docRef).then((userInfo) => {
            const data : any = userInfo.data();
            setUser({...data});
        })
    };

    const uploadProfilePicAndUpdate = (uid: string,  file: File | undefined, setFile : any) => {
        
        const storageRef = ref(storage, `images/${uuidv4()}`);
        if(file){
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', 
            (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                console.log('Upload is paused');
                break;
                case 'running':
                console.log('Upload is running');
                break;
            }
            }, 
            (error) => {
            // Handle unsuccessful uploads
            console.log(error.message);
            }, 
            () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const docRef = doc(db, "users", uid);

                setUser(prevValue => ({
                    ...prevValue,
                    profileImgUrl: downloadURL,
                }))
                updateDoc(docRef, {
                    profileImgUrl: downloadURL,
                }).then(() => {
                    setFile(downloadURL);
                    return downloadURL
                })
            });
            }
        );
      }
    };

    const updateUserCredentials = async (uid: string, email: string, username: string, post_delete_span: string) => {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
            username,
            email,
            post_delete_span
        });
        setUser(prevValue => ({
            ...prevValue,
            email,
            username,
            post_delete_span
        }));
    };

    const updateUserNitro = async (forAMonth : boolean) => {
        if(userAuth?.uid){
            const docRef = doc(db, "users", userAuth?.uid);

            if(forAMonth){
                const dateAMonthFromNow = new Date();
                dateAMonthFromNow.setMonth(dateAMonthFromNow.getMonth() + 1);
                dateAMonthFromNow.toLocaleDateString();
                
                await updateDoc(docRef, {
                    role: "Nitro",
                    nitroExpireDate: dateAMonthFromNow
                });
            } else if(!forAMonth){
                const dateAYearFromNow = new Date();
                dateAYearFromNow.setFullYear(dateAYearFromNow.getFullYear() + 1);
                dateAYearFromNow.toLocaleDateString();
    
                await updateDoc(docRef, {
                    role: "Nitro",
                    nitroExpireDate: dateAYearFromNow
                });
            };
        }
    };

    const removeNitro = async () => {
        if(userAuth?.uid){
            const docRef = doc(db, "users", userAuth.uid);

            await updateDoc(docRef, {
                role: "User",
                nitroExpireDate: ""
            });
        }
    };

    const onLogoutUpdate = async (uid: string) => {
        const docRef = doc(db, "users", uid);

        await updateDoc(docRef, {
            lastLogIn: serverTimestamp()
        });
    }

    const onLoginUpdate = async (uid: string) => {
        const docRef = doc(db, "users", uid);

        await updateDoc(docRef, {
            lastLogIn: "Online",
        });
    }

    const issueStrike = async (uid: string, postId: string) => {
        const docRef = doc(db, "users", uid);

        await updateDoc(docRef,{
            strikes: arrayUnion(postId)
        });
    };

    const changeRole = async (uid: string, role : string) => {
        const docRef = doc(db, "users", uid);

        await updateDoc(docRef, {
            role: role
        });

    };

    const deleteUser = async (uid: string) => {
        const docRef = doc(db, "users", uid);

        await deleteDoc(docRef);
    }

    return {getUserInformation, updateUserInformationWithCountryAndAge, uploadProfilePicAndUpdate, updateUserCredentials, updateUserNitro, removeNitro, onLogoutUpdate, onLoginUpdate, issueStrike, changeRole, deleteUser}
}
export default userHook;