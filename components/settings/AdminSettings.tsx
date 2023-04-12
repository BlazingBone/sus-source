import React, { useEffect, useState } from 'react';
import friendsHook from "../../hooks/friendsHook";
import Image from 'next/image';
import postHook from '@/hooks/postHook';
import { useRecoilState_TRANSITION_SUPPORT_UNSTABLE, useRecoilValue } from 'recoil';
import postAtom from '@/atom/postAtom';
import Post from '../Post';
import Comment from '../Comment';
import userHook from '@/hooks/userHook';

type AdminSettingsProps = {
    
};

const AdminSettings:React.FC<AdminSettingsProps> = () => {
    
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [userRole, setUserRole] = useState("");
    const posts = useRecoilValue(postAtom);
    const {allUsers} = friendsHook();
    const {getPostsByUserId, deleteAllDocsOfAUser, deleteDoc} = postHook();
    const {changeRole, issueStrike, deleteUser} = userHook();

    useEffect(() => {
        let resultUsers : any = []; 
        allUsers.map((user : any) => {
            if(user.username.includes(search)){
                resultUsers = [...resultUsers, user ];
            }
        });
        setSearchedUsers(resultUsers);
    }, [search]);

    useEffect(() => {
        if(selectedUser?.uid){
            getPostsByUserId(selectedUser.uid);
            // getAllCommentsByUserId(selectedUser.uid, setComments);
        }
    }, [selectedUser]);

    const changeUserRole = () => {
        changeRole(selectedUser.uid, userRole);
    }

    const issueTheStrike = () => {
        issueStrike(selectedUser.uid, selectedPost.postId);
        setSearch("");
        setSelectedUser(null);
        setSelectedPost(null);
        setUserRole("");
    }

    const deleteUserPermanent = () => {
        deleteAllDocsOfAUser();
        deleteUser(selectedUser.uid);
    }

    const deletePost = () => {
        deleteDoc(selectedPost.postId);
    }

    return <>
        <div className="relative inline-block w-full h-screen px-5 pt-5 bg-white dark:bg-[#121212]">
            {selectedUser ? (
                <>
                    <div className='flex items-center space-x-2 flex-wrap'>
                        <div className='w-20 h-20 relative'>
                            <Image className='rounded-full' src={selectedUser.profileImgUrl ? selectedUser.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} fill alt="" />
                        </div>
                        <div>
                            <p>{selectedUser.username}</p>
                            <p>{selectedUser.email}</p>
                        </div>
                        <div className='p-3 space-x-2'>
                            <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="rounded-md mb-5 mt-1 w-40 px-2 py-1 border-2">
                                <option>User</option>
                                <option>Nitro</option>
                                <option>Admin</option>
                            </select>
                            <button onClick={changeUserRole} disabled={!userRole} className='dark:bg-[#222222] w-[150px] h-[30px] rounded-xl dark:hover:bg-[#333333]'>Set New Role</button>
                        </div>
                        <div className='flex-1 flex justify-end'>
                            <button className='dark:bg-[#222222] p-2 h-[50px] rounded-xl dark:hover:bg-[#333333]' onClick={deleteUserPermanent}>Delete User Permanently</button>
                        </div>
                    </div>
                    <p className='text-lg underline mt-2'>Posts from {selectedUser.username}:</p>
                    <div className='dark:bg-[#222222] w-full max-h-[40vh] overflow-y-scroll scrollbar-hide mt-5 rounded-lg'>
                        {posts.posts.map((post) => (
                            <div key={post.postId} onClick={() => setSelectedPost(post)} className={`${selectedPost === post.postId && "dark:bg-[#333333]"} dark:hover:bg-[#333333] cursor-pointer`}>
                                <Post post={post} />
                            </div>
                        ))}
                    </div>
                    {
                        selectedPost && (
                        <>
                            <div className='mt-2'>
                                <Post post={selectedPost} />
                            </div>
                            <div className=''>
                                <button onClick={issueTheStrike} className='dark:bg-[#222222] w-[200px] h-[50px] rounded-xl dark:hover:bg-[#333333]'>Issue Strike</button>
                                <button onClick={() => setSelectedPost(null)} className='dark:bg-[#222222] w-[200px] h-[50px] rounded-xl dark:hover:bg-[#333333] ml-2'>Clear Selected Post</button>
                                <button onClick={deletePost} className='dark:bg-[#222222] w-[200px] h-[50px] rounded-xl dark:hover:bg-[#333333] md:ml-2 mt-2'>Delete Post</button>
                            </div>
                        </>
                        )
                    }
                </>
            ) : ( 
                <>
                    <div className="border-l-8 border-blue-300 pl-5 w-full mb-5">
                        <span className="font-mono">Users</span>
                        </div>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} className=' w-full h-[40px] rounded-full p-4 dark:bg-[#222222] rounded-b-none' placeholder='Search a specific user...' />
                        {search && (
                            <div className=' w-full dark:bg-[#222222] divide-y-2 space-y-2'>
                                {
                                searchedUsers.map((user : any) => (
                                    <div key={user?.uid} onClick={() => setSelectedUser(user)} className='w-full flex h-[120px] sm:h-[100px] md:h-[80px] mt-2 lg:h-[55px] dark:hover:bg-[#333333] cursor-pointer '>
                                        <div className='relative h-full w-[100px]'>
                                            <Image src={user.profileImgUrl ? user.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} fill alt="Search User picture" />
                                        </div>
                                        <div className='ml-3 divide-y-2 divide-[#444444] flex-1'>
                                            <div className='lg:flex'>
                                                <p className='mr-2 text-sm xl:text-base'>Username : <span className='font-bold'>{user.username}</span> </p>
                                                <p className='text-sm lg:text-base'>Email: <span className='font-bold'>{user.email}</span></p>
                                            </div>
                                            <div className='lg:flex'>
                                                <p className='mr-2 text-sm xl:text-base'>ID:  <span className='font-bold'>{user.uid}</span> </p>
                                                <p className='text-sm xl:text-base'>Role : <span className='font-bold'>{user.role}</span></p>
                                            </div>
                                        </div>
                                        <div className=' lg:flex'>
                                            <p className=' md:text-xl xl:text-3xl ml-5'>Strikes: <span className='font-bold'>{user.strikes.length}</span></p>
                                            <p className=' md:text-xl xl:text-3xl ml-5'>Posts: <span className='font-bold'>{user.posts.length}</span></p>
                                        <p className=' md:text-xl xl:text-3xl ml-5'>Comments: <span className='font-bold'>{user.comments.length}</span></p>
                                        </div>
                                    </div>
                                    ))
                                }
                            </div>
                        )}
                </>
            )}
        </div>
    </>
}
export default AdminSettings;