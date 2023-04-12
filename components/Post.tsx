import moment from 'moment'; 
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CommentsSection from './CommentsSection';
import postHook from '@/hooks/postHook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import {HandThumbDownIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {TrashIcon} from "@heroicons/react/24/solid";
import { Timestamp } from 'firebase/firestore';

type PostProps = {
    post: {
        message: string;
        userId: string;
        image: string;
        video: string;
        profileImgUrl: string;
        likes: string[];
        dislikes: string[];
        comments: any;
        createdAt: any;
        createdBy: string;
        postId: string;
        isNitro: boolean;
        deleteIn?: any;
    }
};

const Post:React.FC<PostProps> = ({post}) => {

    const [commentsField, setCommentsField] = useState(false);
    const [postComments, setPostComments] = useState([]);
    const [likes, setLikes] = useState([""]);
    const [dislikes, setDislikes] = useState([""]);
    const [userAuth] = useAuthState(auth);
    const [liked, setLiked] = useState(post?.likes?.includes(userAuth?.uid!));
    const [disliked, setDisliked] = useState(post?.dislikes?.includes(userAuth?.uid!));
    const [reportModal, setReportModal] = useState(false);
    const [reportMessage, setReportMessage] = useState("");

    const {executeAction, terminatePost, deletePost, reportPost} = postHook();

    useEffect(() => {
        setPostComments(post.comments);
    }, [post]);

    useEffect(() => {
        setLikes(post.likes);
        setDislikes(post.dislikes);
    }, [post]);

    useEffect(() => {

        const date = Timestamp.fromDate(new Date());
        let datePost : any = post.deleteIn;

        if(post.deleteIn && (datePost.seconds < date.seconds)){
            terminatePost(post.postId);
        }
    }, [])

    useEffect(() => {
        if(userAuth){
            if(likes?.includes(userAuth?.uid)) setLiked(true);
            if(dislikes?.includes(userAuth.uid)) setDisliked(true);
        }
    }, [likes, dislikes]);


    const addOpinion = (action : string) => {
        if(userAuth){
            if(action === "like"){
                setLiked(prevValue => !prevValue);
                if(disliked){
                    setDisliked(prevValue => !prevValue);
                }
            } else if (action === "dislike"){
                setDisliked(prevValue => !prevValue);
                if(liked){
                    setLiked(prevValue => !prevValue);
                }
            };

            executeAction(post.postId, userAuth?.uid, liked , disliked , action, setLikes, setDislikes);
        }
    };

    const report = () => {
        if(userAuth){
            reportPost(post.postId, userAuth?.uid, reportMessage);
        }
        setReportModal(false);
    }

    const deleteYourPost = () => {
        deletePost(post.postId);
    }

    return (
    <div className='mb-5 rounded-lg bg-white dark:bg-[#222222] p-2'>
        <div className="flex w-full"> {/*<!--Post anfang-->*/}
            <div className="inline-block h-full w-20">
                <Link href={`/account/${post.userId}`}> {/*<!--Zum Profil-->*/}
                    <img className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full mt-2 ml-2" src={post.profileImgUrl ? post.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} alt="" />
                </Link> 
            </div>
            <div className="inline-block rounded-r-lg pb-1 min-h-full w-full bg-white dark:bg-[#222222]">
                    <div className='flex items-center' >
                        {
                            post.isNitro && (
                                <div className=" flex -mb-1 ml-2 -mr-2">
                                    <img className='h-4' src="/images/Logo/NITRO.png" />
                                    <img className="h-4" src="/images/Icons/veryfied.png" alt="" /> {/*<!--Erst anzeigen, wenn der Nutzer Nitro gekauft hat-->*/}
                                </div>
                            )
                        }
                        <span className="inline-block font-mono text-gray-500 text-xs ml-2">{post.createdBy}</span>
                        <span className="text-gray-500">&bull;</span>
                        <span className="inline-block font-mono text-gray-500 text-xs">{moment(new Date(post.createdAt?.seconds * 1000) ,"YYYYMMDD").fromNow()}</span>
                    </div>
                    <div className="mx-2 break-words h-fit overflow-y-auto">
                        {post.message}
                    </div>
                <div className='w-full flex items-center justify-center mt-2'>
                    {post.image && (
                        <Link href={post.image} className='max-w-[80%] max-h-[80%] mx-auto p-2'>
                            <img src={post.image} alt="post Image"/>
                        </Link>
                    )}
                    {post.video && (
                        <video className='w-full h-[400px] mx-auto p-2' autoPlay controls>
                            <source src={post.video} />
                        </video>
                    )}
                </div>
            </div> {/*<!--Post Ende-->*/}
        </div>
        {commentsField && (
            <div className='w-full h-[300px]'>
                <CommentsSection setPostComments={setPostComments} comments={postComments} postId={post.postId} />
            </div>
        )}
        <div className="justify-end flex pr-3 h-7 pt-1 ">
            <div className="mr-2 ml-2 rounded-xl px-2 pb-1 bg-gray-200 dark:bg-[#121212] hover:shadow-lg">{/*<!--Wenn aktiviert sollen die DIV's gb-gray-400 haben-->*/}
                <button className=''>
                    {(userAuth && liked) ? (
                        <HandThumbUpIcon onClick={() => addOpinion("like")} className='w-6 h-6 inline-block ' />
                    ) : (
                        <svg onClick={() => addOpinion("like")} className="w-6 h-6  inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                        </svg>
                    )}
                    <span className="inline-block">{likes?.length}</span> {/*<!--Anzahl der Likes-->*/}
                </button>
            </div>

            <div className="mr-2 ml-2 rounded-xl px-2 bg-gray-200 dark:bg-[#121212] hover:shadow-lg">
                <button>
                    {(userAuth && disliked) ? (
                        <HandThumbDownIcon onClick={() => addOpinion("dislike")} className="w-6 h-6 inline-block" />
                    ) : (
                    <>
                        <svg onClick={() => addOpinion("dislike")} className="w-6 h-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                       </svg>
                    </>  
                    )}  
                <span className="inline-block">{dislikes?.length}</span>{/*<!--Anzahl der Dislikes-->  */}                       
                </button>
            </div>    
            <div className="mr-2 ml-2 rounded-xl px-2 bg-gray-200 dark:bg-[#121212] hover:shadow-lg">
                <button onClick={() => setCommentsField(prevValue => !prevValue)}>
                   <svg className="w-6 h-6 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                   </svg>
                  <span className="inline-block">{postComments?.length}</span>{/*<!--Anzahl der Kommentar-->*/}                          
              </button>
            </div>
            <div className='relative'>
                {
                    reportModal && (
                        <div className='absolute -top-[100px] -left-[100px] p-3  bg-gray-200 dark:bg-[#222222] rounded-lg z-[10000]'>
                            <input value={reportMessage} onChange={(e : any) => setReportMessage(e.target.value)} placeholder='Why report?' className='w-[200px] bg-transparent h-[30px] focus:outline-none' />
                            <button onClick={report} className='w-full bg-white hover:bg-gray-100 dark:bg-[#333333] hover:dark:bg-[#222222] rounded-full mt-2 h-[20px]'>
                                Send
                            </button>
                        </div>
                    )
                }
                <button onClick={() => setReportModal(prevValue => !prevValue)} className="mr-2 ml-2 rounded-full w-7 bg-gray-200 dark:bg-[#121212] hover:bg-red-300 dark:hover:bg-red-300">
                        <svg className="w-6 h-6 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>                              
                </button>
            </div>
            {
                userAuth && (userAuth.uid === post.userId) && (
                    <button onClick={deleteYourPost} className='mr-2 ml-2 items-center flex justify-center rounded-full w-7 bg-red-300 dark:bg-red-500 hover:bg-gray-200 dark:hover:bg-[#121212]'>
                        <TrashIcon className='w-6 h-6' />
                    </button>
                ) 
            }           
        </div>
    </div>
    )
}
export default Post;