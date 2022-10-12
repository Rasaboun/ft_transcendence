import axios from "axios";
import { Imatch } from "../Utils/type";
import { backUrl } from "./users";

export async function getUserMatches(login: string)
{
    const url: string = backUrl + "/match/user";
    await axios.get<Imatch>(url, {params: {login}}).then(res => {
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