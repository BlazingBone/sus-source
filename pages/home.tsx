import React, { useEffect, useRef, useState } from 'react';
import {signOut} from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import {useRecoilState, useRecoilState_TRANSITION_SUPPORT_UNSTABLE} from "recoil";
import userAtom from '@/atom/userAtom';
import { useRouter } from 'next/router';
import userHook from '@/hooks/userHook';
import PhotoIcon from "@heroicons/react/24/outline/PhotoIcon";
import VideoIcon from "@heroicons/react/24/outline/VideoCameraIcon"
import postHook from '@/hooks/postHook';
import PreviewModal from '@/components/PreviewModal';
import postAtom from '@/atom/postAtom';
import Post from '@/components/Post';
import FriendsSearchSection from '@/components/FriendsSearchSection';
import TopPostsSection from '@/components/TopPostsSection';
import { Timestamp } from 'firebase/firestore';
import Loader from '@/components/Loader';
import Image from 'next/image';
 
type homeProps = {
    
};

const Home:React.FC<homeProps> = () => {

    const [userAuth, loading, userError]  = useAuthState(auth);
    const {getUserInformation, removeNitro} = userHook();
    const {uploadPostImage, createPost, getAllPosts, getMorePosts} = postHook();
    const [user, setUser] = useRecoilState(userAtom);
    const [posts, setPosts] = useRecoilState(postAtom);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState<any>(null);
    const [videoLoading, setVideoLoading] = useState(false);

    const imageRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);

    const BannedWords = [
        "bitch",
        "schlampe",
        "arschloch",
        "nutte",
        "hurensohn",
        "bastard",
        "wichser",
        "fotze",
        "hackfresse",
        "nigger",
        "nigga"
    ];

    useEffect(() => {
        const runInitation = async () => {
            if(userAuth?.uid){
                await getUserInformation(userAuth.uid);
                await getAllPosts();
            }
            else if (!userAuth?.uid && loading === false){
                router.push("/login");
            }
            setLoaded(true);
            console.log("loaded");
        }

        runInitation();
    }, [userAuth]);

    useEffect(() => {
        if(user.nitroExpireDate){
            const date = Timestamp.fromDate(new Date());

            let expireDate : any = user.nitroExpireDate;

            if(expireDate?.seconds < date.seconds){
                removeNitro();
            }
        }
    }, [user]);

    const uploadImage = async (file: any) => {
        await uploadPostImage(file, setImage, "images");
    };

    const uploadVideo = async (file: any) => {

        await uploadPostImage(file, setVideo, "videos");

    }

    const createThePost = async () => {

        const messageWords = message.split(" ");
        let problematicWord : string[] = [];

        BannedWords.map((word) => {
            messageWords.map((messageWord) => {
                if(messageWord.toLowerCase() == word){
                    problematicWord.push(word);
                };
            });

            if(problematicWord.length){
                const problemWords = problematicWord.join(",");
                setError(`Sorry there are banned words in your post: ${problemWords}`);
            };
        });

        if(!problematicWord.length){
            if(userAuth) {
                await createPost(userAuth.uid, message, user.username, image!, user.profileImgUrl, video);
            };
            getAllPosts();
            setMessage("");
            setError("");
            setImage(null);
            setVideo(null);
        }
    };

    if(!loaded || !posts){
        return (
            <div className='w-[100vw] h-[100vh] flex items-center justify-center'>
                <Loader />
            </div>
        )
    };

    const handleScroll = (e : any) => {
        const bottom = Math.floor(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight;

        if(bottom){
            getMorePosts();
        }
    }
    
    return (
    <div className="relative bg-neutral-300 dark:bg-[#181818]">
        <div className="flex border-b-[1px] border-neutral-900 border-opacity-10"> {/*<!--Head Bereich Anfang-->*/}
            <div className="h-0 lg:h-36 lg:w-80 lg:flex lg:justify-center lg:items-center border-r-2 border-opacity-10 border-neutral-700 lg:bg-transparent">{/*<!--Hintergrundfarbe ändern-->*/}
                <img className="lg:inline-block lg:h-20 lg:w-auto lg:mt-5 lg:ml-7 h-0 w-0" src="/images/Logo/SUS_final.png" alt="" />
            </div> 
            <div className=" flex-1 inline-block w-36 bg-transparent min-w-[300px]">{/*<!--Hintergrundfarbe ändern-->*/}
                <div className="flex">
                    <div className="h-40 inline-block bg-trasnparent">{/*<!--Hintergrundfarbe ändern-->*/}
                        <img className="w-24 h-24 rounded-full object-cover mt-8 ml-5"  src={user.profileImgUrl ? user.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} alt="" /> {/*<!--Profilbild einfügen-->*/}
                    </div>
                    <div className="flex-1 h-40 bg-transparent inline-block">{/*<!--Hintergrundfarbe ändern-->*/}
                        <div className="p-5"> {/*<!--Text-Input-->*/}
                            <input value={message} onChange={(e : React.ChangeEvent<HTMLInputElement> ) => setMessage(e.target.value)} className="w-full p-2 rounded-xl mt-8 break-words" type="text" placeholder="Anything to say?" />
                        </div>
                        <div className="flex justify-between mr-6">
                            <div className='flex ml-10 '>
                                <input ref={videoRef} className='hidden' onChange={(e : any) => uploadVideo(e.target.files?.[0])} type='file' accept='video/mp4' />
                                <VideoIcon onClick={() => videoRef?.current?.click()}  className='h-6 w-6 mr-4 cursor-pointer hover:text-blue-700 rounded-full' />
                                <input ref={imageRef} className='hidden' onChange={(e : any) => uploadImage(e.target.files?.[0])} type='file' accept='image/jpg image/jpeg image/gif' />
                                <PhotoIcon onClick={() => imageRef?.current?.click()} className='h-6 w-6 cursor-pointer hover:text-red-700 rounded-full' />
                            </div>
                            <button className="border-gray-500 bg-zinc-200 dark:bg-zinc-800 rounded-2xl -mt-3 w-20 h-8 font-bold hover:opacity-70 active:bg-zinc-400" onClick={createThePost} >Send</button>
                        </div>
                        {
                                error && (
                                    <p className="w-full text-center text-red-300">
                                        {error}
                                    </p>
                                )
                        }
                        {
                            videoLoading && (
                                <p className='w-full text-center text-yellow-400'>
                                    Please wait just a moment for the upload...
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="h-0 lg:h-36 lg:w-80 lg:inline-block border-l-2 border-opacity-10 border-neutral-700 lg:bg-transparent">{/*<!--Hintergrundfarbe ändern-->*/}
                <div className="flex">
                    <div className="lg:h-full lg:flex-1 lg:justify-center lg:mt-12 lg:ml-5 h-0 w-0">
                        <p className="hidden lg:inline-block lg:font-semibold lg:text-lg lg:break-words">{user.username}</p>
                        <br />
                        <span className="hidden lg:inline-block lg:font-extralight lg:antialiased lg:text-sm lg:from-stone-600 lg:break-words">{user.email} </span>
                    </div>
                    <div className="lg:justify-items-end">
                        <a href={`/account/${userAuth?.uid}`}> {/*<!--Zum Profil-->*/}
                            <img className="lg:w-28 lg:h-28 lg:rounded-full lg:object-cover lg:mt-5 lg:mr-5 h-0 w-0" src={user.profileImgUrl ? user.profileImgUrl : "/images/Profile Picture/Profile Picture.jpg"} alt="" /> {/*<!--Profilbild einfügen-->*/}
                        </a>
                    </div>
                </div>
            </div>
        </div>{/*<!--Head Bereich Ende-->*/}

        <div className="lg:flex ">{/*<!--Body Bereich Anfang-->  */}
            <div className="lg:inline-block space-y-1 lg:w-80 lg:h-[87vh] lg:bg-transparent lg:p-5 w-0 h-0 overflow-y-scroll scrollbar-hide border-r-2 border-neutral-700 border-opacity-10"> {/*<!--Hintergrund kann man nich verändern-->*/}
                <FriendsSearchSection friends={user.friends} />
            </div>


            <div onScroll={handleScroll} className="inline-block flex-1 h-[86vh] min-w-[300px] w-full p-5 overflow-y-scroll scrollbar-hide bg-transparent">
                {posts.posts.map((post) => (
                    <Post key={post.postId} post={post} />
                ))}
            </div>

            <TopPostsSection />

        </div>{/*Body Bereich Ende  */}
        {(image || video) && (
            <PreviewModal message={message} setMessage={setMessage} image={image} video={video} createPost={createThePost} setVideo={setVideo} setImage={setImage} error={error}/>
        )}
    </div>
    )
}
export default Home;
