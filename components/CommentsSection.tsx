import userAtom from '@/atom/userAtom';
import Image from 'next/image';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Comment from './Comment';
import postHook from '@/hooks/postHook';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';

type CommentsSectionProps = {
    comments: {
        comment: string,
        userId: string,
        commentId: string,
        createdBy: string,
        createdAt: any,
        commentUserImage: string;
    }[];
    postId: string;
    setPostComments: any;
};

const CommentsSection:React.FC<CommentsSectionProps> = ({comments, postId, setPostComments}) => {
    
    const [userAuth] = useAuthState(auth);
    const user = useRecoilValue(userAtom);
    const [comment, setComment] = useState("");
    const {addComment} = postHook();

    const createComment = () => {
        if(comment){
            addComment(postId, comment, userAuth?.uid, user.username, user.profileImgUrl, setPostComments);
            setComment("");
        };
    }

    return (
        <div className='mt-2'>
            <div className='flex w-[100%]'>
                <div className='w-[50px] h-[50px]  rounded-full relative'>
                    <Image className='rounded-full' src={user.profileImgUrl} fill alt="Profile Image" />
                </div>
                <div className='flex items-center border-b dark:border-zinc-500 border-gray-200 p-2 w-full'>
                    <input value={comment} onChange={(e) => setComment(e.target.value)} className='flex-1 p-2 h-[40px] rounded-full ml-2 outline-none' placeholder='Got Something to say? Leave a comment!' />
                    <button onClick={createComment} className='w-[100px] h-[40px] rounded-lg bg-gray-100 dark:bg-[#333333] dark:hover:bg-[#121212] hover:bg-gray-200 ml-3'>
                        Send
                    </button>
                </div>
            </div>
            <div className='overflow-y-scroll h-full scrollbar-hide'>
                {comments.map((comment) => (
                    <Comment comment={comment} />
                ))}
            </div>
        </div>      
    )
}
export default CommentsSection;