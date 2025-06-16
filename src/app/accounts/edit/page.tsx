import { getCookieServer } from "@/lib/cookiesServer";

import Edit from "./components/index";

export default async function Editpage(){
    const token = await getCookieServer();

    return <Edit token={token}/>
}