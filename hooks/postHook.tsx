import { db, storage } from '@/firebase/firebase';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRecoilState, useRecoilValue } from 'recoil';
import postAtom from '@/atom/postAtom';
import userAtom from '@/atom/userAtom';
import { StringLiteralType } from 'typescript';

const postHook = () => {
    
    const [posts, setPosts] = useRecoilState(postAtom);
    const [topPosts, setTopPosts] = useState<any>([]);
    const [strikedPosts, setStrikedPosts] = useState<any>([]);
    const [lastVisible, setLastVisible] = useState<{}>();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        fetchTopPosts();
    }, [])

    const uploadPostImage = async (file: File, set: any, type: string) => {

        const storageRef = ref(storage, `${type}/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is ", progress, "% done");
            switch(snapshot.state){
                case "paused":
                    console.log("Upload is paused");
                    break;
                case "running":
                    console.log("Upload is running");
                    break;
            }
        }, (error) => {
            console.log(error.message);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
                set(downloadURL);
                return downloadURL;
            })
        });

    };

    const createPost = async ( uid : string, message: string, username: string, downloadURL: string, profileImgUrl : string, video: string) => {
        const postId = uuidv4();
        const docRef = doc(db, "posts", postId);

        const createdAt = serverTimestamp();

        let deleteDate : Date | string = new Date() ;

        switch (user.post_delete_span) {
            case "1 Tag":
                break;
            case "2 Tage":
                deleteDate.setDate(deleteDate.getDate() + 2);
                break;
            case "3 Tage":
                deleteDate.setDate(deleteDate.getDate() + 3)
                break;
            default:
                deleteDate = "";
                break;
        }

        const postObject : any = {
            message,
            userId: uid,
            profileImgUrl,
            image: downloadURL,
            video: video,
            likes: [],
            dislikes: [],
            comments: [],
            createdAt,
            createdBy: username,
            postId,
            isNitro: user.role === "Nitro" || user.role === "Admin",
            deleteIn: deleteDate
        };

        await setDoc(docRef, postObject);

        return postObject;
    };

    const getAllPosts = async() => {

        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20)); //if necessairy, limit the amount of posts here

        const querySnapshot = await getDocs(q);

        setPosts(prevValue => ({
            ...prevValue,
            posts: []
        }));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            setPosts(prevValue => ({
                posts: [
                    ...prevValue.posts,
                    {
                        message: data.message,
                        comments: data.comments,
                        profileImgUrl: data.profileImgUrl,
                        createdAt: data.createdAt,
                        createdBy: data.createdBy,
                        dislikes: data.dislikes,
                        image: data.image,
                        video: data.video,
                        likes: data.likes,
                        userId: data.userId,
                        postId: data.postId,
                        isNitro: data.isNitro,
                        deleteIn: data.deleteIn
                    }
                ]
            }));
        });

        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        console.log("Posts successfully recieved");
    };

    const getMorePosts = async () => {
        if(lastVisible){
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastVisible) , limit(20));

            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                setPosts(prevValue => ({
                    posts: [
                        ...prevValue.posts,
                        {
                            message: data.message,
                            comments: data.comments,
                            profileImgUrl: data.profileImgUrl,
                            createdAt: data.createdAt,
                            createdBy: data.createdBy,
                            dislikes: data.dislikes,
                            image: data.image,
                            video: data.video,
                            likes: data.likes,
                            userId: data.userId,
                            postId: data.postId,
                            isNitro: data.isNitro,
                            deleteIn: data.deleteIn
                        }
                    ]
                }))
            });
    
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        }
    }

    const getPostsByUserId = async (uid: string) => {
        const q = query(collection(db, "posts"), where("userId", "==", uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        setPosts(prevValue => ({
            ...prevValue,
            posts: []
        }));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            setPosts(prevValue => ({
                ...prevValue,
                posts: [
                    ...prevValue.posts,
                    {
                        message: data.message,
                        comments: data.comments,
                        profileImgUrl: data.profileImgUrl,
                        createdAt: data.createdAt,
                        createdBy: data.createdBy,
                        dislikes: data.dislikes,
                        image: data.image,
                        video: data.video,
                        likes: data.likes,
                        userId: data.userId,
                        postId: data.postId,
                        isNitro: data.isNitro,
                        deleteIn: data.deleteIn
                    }
                ]
            }));
        });
    };

    const addComment = async (postId: string, comment: string, userId: string |undefined, createdBy: string, commentUserImage: string, setPostComments: any) => {
        try {
            if(userId){
                const docRef = doc(db, "posts", postId);
                const userDocRef = doc(db, "users", userId);
                const commentId = uuidv4();

                setPostComments((prevValue: any) => ([
                    ...prevValue,
                    {
                        comment,
                        userId,
                        commentId,
                        createdBy,
                        commentUserImage
                    }
                ]));
    
                await updateDoc(docRef, {
                    comments: arrayUnion({
                        comment,
                        userId,
                        commentId,
                        createdBy,
                        commentUserImage
                    })
                });
    
                await updateDoc(userDocRef, {
                    comments: arrayUnion(commentId)
                });
    
                let commentedPostIndex = posts.posts.findIndex(post => post.postId === postId);
                posts.posts[commentedPostIndex].comments.push({
                    comment,
                    userId,
                    createdBy,
                    commentUserImage
                });
    
                console.log("Comment successfully updated");
            }

        } catch (error : any) {
            console.log(error.message);   
        }
    };

    const addOpinion = async (postId: string, userId: string, action: string) => {

        try {
            const postRef = doc(db, "posts", postId);
            const userRef = doc(db, "users", userId)

            if(action === "like"){

                await updateDoc(postRef, {
                    likes: arrayUnion(userId)
                });
    
                await updateDoc(userRef, {
                    likes: arrayUnion(postId)
                });

            } else if (action === "dislike"){

                await updateDoc(postRef, {
                    dislikes: arrayUnion(userId)
                });
    
                await updateDoc(userRef, {
                    dislikes: arrayUnion(postId)
                });

            } else {

                console.log("Wanted Action not recieved, please try again.");

            };
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const removeOpinion = async (postId: string, userId: string, action: string) => {
        try {
            const postRef = doc(db, "posts", postId);
            const userRef = doc(db, "users", userId);

            switch (action) {
                case "like":
                    await updateDoc(postRef, {
                        likes: arrayRemove(userId) 
                    });
                    await updateDoc(userRef, {
                        likes: arrayRemove(postId)
                    });
                    break;
                case "dislike" :
                    await updateDoc(postRef, {
                        dislikes: arrayRemove(userId) 
                    });
                    await updateDoc(userRef, {
                        dislikes: arrayRemove(postId)
                    });
                    break;
                default:
                    break;
            }


        } catch (error : any) {
            console.log(error.message);
        }
    };

    const executeAction = async (postId: string, userId: string, liked: boolean, disliked: boolean, action: string, setLikes: any, setDislikes: any) => {
        try {
            if(!liked && !disliked){
                if(action === "like"){

                    addOpinion(postId, userId, action);
                    setLikes((prevValue: string[]) => ([
                        ...prevValue,
                        userId
                    ]));

                } else if (action === "dislike"){

                    addOpinion(postId, userId, action);
                    setDislikes((prevValue: string[]) => ([
                        ...prevValue,
                        userId
                    ]));

                } else {

                    return;

                }
            } else if (liked && !disliked){
                if(action === "like"){

                    removeOpinion(postId, userId, "like");
                    setLikes((prevValue: string[]) => ([...prevValue.filter(like => like !== userId)]));

                } else if(action === "dislike"){

                    addOpinion(postId, userId, action);
                    setDislikes((prevValue: string[]) => ([
                        ...prevValue,
                        userId
                    ]));

                    removeOpinion(postId, userId, "like");
                    setLikes((prevValue: string[]) => ([
                        ...prevValue.filter(like => like !== userId)
                    ]))
                }
            } else if (!liked && disliked){
                if(action == "like"){

                    addOpinion(postId, userId, action);
                    setLikes((prevValue: string[]) => ([
                        ...prevValue,
                        userId
                    ]));

                    removeOpinion(postId, userId, "dislike");
                    setDislikes((prevValue: string[]) => ([
                        ...prevValue.filter(dislike => dislike !== userId)
                    ]));

                } else if (action === "dislike"){

                    removeOpinion(postId, userId, action);
                    setDislikes((prevValue: string[]) => ([
                        ...prevValue.filter(dislike => dislike !== userId)
                    ]));
                }
            } else {
                removeOpinion(postId, userId, "like");
                setLikes((prevValue: string[]) => ([
                    ...prevValue.filter(like => like !== userId)
                ]))

                removeOpinion(postId, userId, "dislike");
                setDislikes((prevValue: string[]) => ([
                    ...prevValue.filter(dislike => dislike !== userId)
                ]));
            };
        } catch (error : any) {
            console.log(error.message);
        }
    };

    const fetchTopPosts = async () => {

        setTopPosts([]);

        let fetchedPosts : any = [];

        const q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(5));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const docData = doc.data();

            fetchedPosts = [...fetchedPosts, doc.data()];
        });

        setTopPosts(fetchedPosts);
    };

    const fetchStrikesPosts = async (strikes: string[]) => {
        if(strikes.length > 0){
            const q = query(collection(db, "posts"), where("postId", "in", strikes));

            const querySnapshot = await getDocs(q);
            let docDataArray : any[] = [];
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                docDataArray = [...docDataArray, doc.data()];
            });
    
            setStrikedPosts(docDataArray);
        } else {
            setStrikedPosts([]);
        }
    };

    const terminatePost = async (postId: string) => {
        
        const docRef = doc(db, "posts", postId);

        await deleteDoc(docRef);

    };

    const getPostByPostId = async (postId: string, setPost: any) => {
        const docRef = doc(db, "posts", postId);

        await getDoc(docRef).then((postDate) => {
            const data = postDate.data();

            setPost(data);
        });

    };

    // const getAllCommentsByUserId = async (uid: string, setComments: any) => {
    //     try {
    //         const q = query(collection(db, "posts"), where("comments", "array-contains", uid));

    //         const querySnapshot = await getDocs(q);
    
    //         querySnapshot.forEach((doc) => {
    //             const docData = doc.data();
    
    //             setComments((prevValue: any) => [
    //                 ...prevValue,
    //                 docData
    //             ]);
    //         });
    //     } catch (error : any) {
    //         console.log(error.message);
    //     }

    // }

    const deleteAllDocsOfAUser = async () => {
        
        posts.posts.map((post) => {
            const docRef = doc(db, "posts", post.postId);

            deleteDoc(docRef);
        });

    };

    const deletePost = async (postId: string) => {
        let allPostsExceptDeleted : any = posts.posts.filter((post) => post.postId !== postId);

        console.log(allPostsExceptDeleted);

        setPosts(prevValue => ({
            ...prevValue,
            posts: [
                ...allPostsExceptDeleted
            ]
        }))

        const docRef = doc(db, "posts", postId);

        await deleteDoc(docRef);
    };

    const reportPost = async (postId: string, createdBy: string, message: string) => {
        const docRef = doc(db, "reports", uuidv4());

        await setDoc(docRef,{
            postId,
            createdBy,
            message
        })
    }

    return {executeAction,uploadPostImage, createPost, getPostsByUserId, addComment, getAllPosts, topPosts, fetchStrikesPosts, strikedPosts, terminatePost, getPostByPostId, deleteAllDocsOfAUser, deleteDoc, getMorePosts, reportPost, deletePost}
}
export default postHook;