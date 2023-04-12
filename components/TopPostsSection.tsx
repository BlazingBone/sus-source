import React, { useEffect } from 'react';
import TopPostCart from './TopPostCart';
import postHook from '@/hooks/postHook';

type TopPostsSectionProps = {
    
};

const TopPostsSection:React.FC<TopPostsSectionProps> = () => {

    const {topPosts} = postHook();

    return (
        <div className="lg:inline-block lg:w-80 lg:h-[87vh] lg:bg-transparent lg:overflow-y-auto p-5 border-l-2 border-opacity-10 border-neutral-700">
            {
                topPosts.map((post : any) => (
                    <TopPostCart key={post.postId} postMessage={post.message} postId={post.postId} createdBy={post.userId} username={post.createdBy} isNitro={post.isNitro}  />
                ))
            }
        </div>
    )
}
export default TopPostsSection;