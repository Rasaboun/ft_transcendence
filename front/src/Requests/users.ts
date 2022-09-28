import axios from "axios";

export const backUrl = "http://localhost:3002"; 

export enum UserStatus {
    offline,
    online,
    ingame,
}

export async function getUsername(login: string)
{
    const url: string = backUrl + "/users/username";
    axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function getUserStatus(login: string)
{
    const url: string = backUrl + "/users/status";
    axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function getUserPhoto(login: string)
{
    const url: string = backUrl + "/users/photo";
    axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function setUserStatus(login: string, status: UserStatus)
{
    const url: string = backUrl + "/users/status";
    axios.put(url, {login, status}).then(res => {

    }).catch(e => console.log)
}

export async function setUsername(login: string, username: string)
{
    const url: string = backUrl + "/users/username";
    axios.put(url, {login, username}).then(res => {

    }).catch(e => console.log)
}

export async function setUserPhoto(login: string, photoUrl: string)
{
    const url: string = backUrl + "/users/photo";
    axios.put(url, {login, photoUrl}).then(res => {

    }).catch(e => console.log)
}


export async function blockUser(callerlogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/block";
    axios.put(url, {callerlogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}

export async function unblockUser(callerlogin: string, targetLogin: string)
{
    const url: string = backUrl + "/users/unblock";
    axios.put(url, {callerlogin, targetLogin}).then(res => {

    }).catch(e => console.log)
}




