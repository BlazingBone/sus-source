import {atom} from "recoil";

export const initialState = {
    username : "",
    email : "",
    age: "",
    country: "",
    role : "User",
    profileImgUrl: "",
    lastLogIn: "",
    posts: [],
    post_delete_span: "3 Tage",
    comments: [],
    friends: [""],
    likes: [],
    dislikes: [],
    strikes: [],
    nitroExpireDate: "",
}

const userAtom = atom({
    key: "userStateAtom",
    default: initialState
})

export default userAtom;