import axios from "axios";
import { Imatch } from "../Utils/type";
import { backUrl } from "./users";

export async function getUserMatches(login: string): Promise<Imatch[] | null>
{
    const url: string = backUrl + "/match/user";
    let matchs: Imatch[] = [];
    await axios.get<Imatch[]>(url, {params: {login}}).then(res => {
        matchs = res.data;
    }).catch(e => console.log)

    return matchs;
}

export async function getAllMatches()
{
    const url: string = backUrl + "/match/user";
    const res = await axios.get(url, ).then(res => {
        return res.data;
    }).catch(e => console.log)

    return res;
}