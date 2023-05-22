import Image from 'next/image';
import React from 'react';
import moment from "moment";

type CommentProps = {
    comment: {
        comment: string,
        userId: string,
        commentId: string,
        createdBy: string,
        createdAt: any,
        commentUserImage: string;
    }
};

const Comment:React.FC<CommentProps> = ({comment}) => {

    return (
        <div className='w-full flex ml-[20px] mt-3'>
            <div className='w-[30px] h-[30px] rounded-full relative'>
                <Image className='rounded-full' src={comment.commentUserImage} fill alt="Profile Image" />
            </div>
            <div>
                <span className="inline-block font-mono text-gray-500 text-xs ml-2">{comment.createdBy}</span>
                <div className="mx-2 break-words h-fit overflow-y-auto">
                    {comment.comment}
                </div>
            </div>
        </div>
    )
}
export default Comment;