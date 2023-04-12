import FriendsSearchSection from '@/components/FriendsSearchSection';
import Post from '@/components/Post';
import TopPostsSection from '@/components/TopPostsSection';
import postHook from '@/hooks/postHook';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type PostPageProps = {
    
};

const PostPage:React.FC<PostPageProps> = () => {
    
    const router = useRouter();
    const [post, setPost] = useState<any>({});
    const {getPostByPostId} = postHook();
    const {postId} = router.query;

    useEffect(() => {
        if(typeof postId === "string"){
            getPostByPostId(postId, setPost);
        }
    }, [postId]);

    return (
        <div className="relative bg-neutral-300 dark:bg-[#121212]">

        <div className="lg:flex ">{/*<!--Body Bereich Anfang-->  */}
            <div className="inline-block flex-1 h-[87vh] min-w-[300px] w-full p-5 overflow-y-scroll scrollbar-hide bg-transparent">
                <Post post={post} />
            </div>
            <TopPostsSection />
        </div>{/*Body Bereich Ende  */}
    </div>
    )
}
export default PostPage;