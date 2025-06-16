//npm install cookies-next

import { getCookie } from "cookies-next";

//pegar cookie do lado do cliente
export function getCookieClient(){
    const token = getCookie("session")

    return token;
}