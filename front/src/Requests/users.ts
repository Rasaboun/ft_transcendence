import axios from "axios";
import { Iuser } from "../Utils/type";

export const backUrl = "http://localhost:3002"; 

export enum UserStatus {
    offline,
    online,
    ingame,
}

export async function getUserProfile(login :string)
{
    const url: string = backUrl + "/users/profile";
    let user;
    await axios.get<Iuser>(url, {params: {login}}).then(res => {
        user = res.data;
    }).catch(e => console.log)
    return user;
}

export async function getUsername(login: string)
{
    const url: string = backUrl + "/users/username";
    await axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function getUserStatus(login: string)
{
    const url: string = backUrl + "/users/status";
    await axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function getUserPhoto(login: string)
{
    const url: string = backUrl + "/users/photo";
    await axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
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

export async function setUserPhoto(login: string, photoUrl: string)
{
    const url: string = backUrl + "/users/photo";
    await axios.put(url, {login, photoUrl}).then(res => {

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




