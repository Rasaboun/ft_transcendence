import axios from "axios";
import { Friend, Iuser } from "../Utils/type";
import { Buffer } from 'buffer'
import Cookies from "js-cookie";
import useLocalStorage from "../hooks/localStoragehook";
import { UsersIcon } from "@heroicons/react/outline";

export const backUrl = `${process.env.REACT_APP_BACK_ADDRESS}:${process.env.REACT_APP_BACK_PORT}`;



export enum UserStatus {
    offline,
    online,
    ingame,
}

export async function getUsers(login :string): Promise<Iuser[] | null>
{
    const url: string = backUrl + "/users/";
    let users: Iuser[] = [];
    await axios.get<Iuser[]>(url, {params: {login}}).then(res => {
        users = res.data;
    }).catch(e => console.log)
    return users;
}

export async function getUserProfile(login :string): Promise<Iuser | null>
{
    const url: string = backUrl + "/users/profile";
    let user: Iuser | null = null;
    await axios.get<Iuser>(url, {params: {login}}).then(res => {
        user = res.data;
    }).catch(e => console.log)
    return user;
}

export async function getUsername(login: string): Promise<string>
{
    let username: string = "";
    const url: string = backUrl + "/users/username";
    await axios.get<string>(url, {params: {login}}).then(res => {
       username = res.data;
    }).catch(e => console.log)
    return username;
}

export async function getUserStatus(login: string)
{
    let status: UserStatus = UserStatus.offline;
    const url: string = backUrl + "/users/status";
    await axios.get<UserStatus>(url, {params: {login}}).then(res => {
        status = res.data;
    }).catch(e => console.log)
    return status;
}

export async function getUserPhoto(login: string): Promise<string>
{
    const url: string = backUrl + "/users/photo";
    const photo = await axios.get(url, {params: {login}}).then(res => {
       

        var binary = '';
        var bytes = new Uint8Array(Buffer.from(res.data.imageBuffer, 'base64'));
        var base64Flag = 'data:image/;base64,';
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return base64Flag +  window.btoa(binary);     
    })

    return photo;
}

export async function getUserFriends(login: string): Promise<Friend[]>
{
    const url: string = backUrl + "/users/friendList";
    
    const friendList = await axios.get(url, {params: {login}}).then(res => {
        return res.data;
    })

    return friendList;
}

export async function getFriendship(callerLogin: string, targetLogin: string): Promise<boolean>
{
    const url: string = backUrl + "/users/isFriend";
    
    const friendList = await axios.get(url, {params: {callerLogin, targetLogin}}).then(res => {
        return res.data;
    })

    return friendList;
}


export async function setUserStatus(login: string, status: UserStatus)
{
    const url: string = backUrl + "/users/status";
    await axios.put(url, {login, status}).then(res => {

    }).catch(e => console.log)
}

export async function setUsername(login: string, username: string)
{
    const url: string = backUrl + "/users/username";
    let taken = false;
    await axios.put(url, {login, username}).then(res => {
    }).catch(e => {taken = true})

    return taken;
}

export async function setUserPhoto(login: string, photo: File)
{
    console.log("Sending request, photo", photo);
    const data = new FormData();
    data.append('photo', photo);
    data.append('login', login);
    const url: string = backUrl + "/users/photo";

    await axios.put(url, data).then(res => {
    }).catch(e => console.log)
}

export async function addFriend(login: string, friendLogin: string)
{
    const url: string = backUrl + "/users/friend";

    await axios.put(url, {login, friendLogin}).then(res => {
    }).catch(e => console.log)
}

export async function removeFriend(login: string, friendLogin: string)
{
    const url: string = backUrl + "/users/friend";

    return await axios.delete(url, {data: {login, friendLogin}}).then(res => {
        return res.data;
    }).catch(e => console.log)
}

export async function blockUser(callerLogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/block";
    await axios.put(url, {callerLogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}

export async function unblockUser(callerLogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/unblock";
    await axios.put(url, {callerLogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}

export async function generateQrCode(login: string)
{
    const url: string = backUrl + "/auth/generate2fa";
    const qrcode = await axios.post(url, {login}, {
        responseType: 'blob',
    }).then(res => {
        return res.data;
    }).catch(e => console.log)

    return URL.createObjectURL(qrcode);
}

export async function enableTwoFactorAuthentication(callerLogin: string, code: string): Promise<boolean> {
    const url: string = backUrl + "/auth/enable2fa";

    let isCodeValid = false;
    const ret = await axios.post(url, {login: callerLogin, code}).then(res => {
        return true;
    }).catch((e) => console.log(e))
    if (ret == true)
        return true;
    return false;
}

export async function disableTwoFactorAuthentication(callerLogin: string)
{
    const url: string = backUrl + "/auth/disable2fa";
    await axios.post(url, {login: callerLogin}).then(res => {
   
    }).catch(e => console.log)

}
export async function isInBlocklist(callerLogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/isblocked";
    const isBlocked: boolean = await axios.get(url, {params: {callerLogin, targetLogin}}).then(res => {
        return res.data
    }).catch(e => console.log)

    return isBlocked;
}

export async function submitTwoFactorAuthentication(code: string)
{

    const url: string = backUrl + "/auth/submit2fa";
    const login = Cookies.get('login');

    const ret = await axios.post(url, {login, code}).then(res => {
        return res.data;
    }).catch(e => console.log)
    return ret;
}
