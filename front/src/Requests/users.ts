import axios from "axios";
import { Iuser } from "../Utils/type";
import { Buffer } from 'buffer'
export const backUrl = "http://localhost:3002"; 

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
function arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    console.log("bytes", bytes);
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

export async function getUserPhoto(login: string): Promise<string>
{
    const url: string = backUrl + "/users/photo";
    const photo = await axios.get(url, {params: {login}}).then(res => {
       
        // let buf = Buffer.from(res.data, 'base64');
        // let base64buf = buf.toString('base64');
        //const blobFile = new File([res.data], login + ".jpeg", {type: 'image/*'});

        
        return res.data
    })
    var base64Flag = 'data:image/jpeg;base64,';

    var imageStr = arrayBufferToBase64(Buffer.from(photo, 'base64'));
    console.log("imagestr", imageStr);
    return base64Flag + imageStr;
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




