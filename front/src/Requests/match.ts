import axios from "axios";
import { backUrl } from "./users";

export async function sendGameResult(gameData: any)
{
    const url:string = backUrl + "/match/result/";
    await axios.post(url, {...gameData}).then(res => {
        
    }).catch(e => console.log)
}

export async function getUserMatches(login: string)
{
    const url: string = backUrl + "/match/user";
    await axios.get(url, {params: {login}}).then(res => {
        return res;
    }).catch(e => console.log)
}

export async function getAllMatches()
{
    const url: string = backUrl + "/match/user";
    await axios.get(url, ).then(res => {
        return res;
    }).catch(e => console.log)
}