import Post from "@/components/Post";
import {atom} from "recoil";

export const initialState = {
    posts: [
        {
            message: "",
            userId: "",
            image: "",
            video: "",
            profileImgUrl: "",
            likes: [""],
            dislikes: [""],
            comments: [{}],
            createdAt: "",
            createdBy: "",
            postId: "",
            isNitro: false,
            deleteIn: "",
        }
    ]
}

const postAtom = atom({
    key: "postStateAtom",
    default: initialState
})

export default postAtom;