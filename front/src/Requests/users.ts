import axios from "axios";
import { Friend, Iuser } from "../Utils/type";
import { Buffer } from 'buffer'
export const backUrl = "http://localhost:${process.env.BACK_PORT}"; 

export enum UserStatus {
    offline,
    online,
    ingame,
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
        console.log(res.data)
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
    await axios.put(url, {login, username}).then(res => {

    }).catch(e => console.log)
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

export async function blockUser(callerlogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/block";
    await axios.put(url, {callerlogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}

export async function unblockUser(callerlogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/unblock";
    await axios.put(url, {callerlogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}




