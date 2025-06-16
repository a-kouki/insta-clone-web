import { NextRequest, NextResponse } from 'next/server'
import { getCookieServer } from '@/lib/cookiesServer'
import { api } from "@/services/api"

export async function middleware(req: NextRequest){
  const { pathname } = req.nextUrl //saber quao rota esta navegando
  
  //se a rota for igual a / ou /_next, deixa renderizar
  if(pathname.startsWith("/_next") || pathname === "/"){ 
    return NextResponse.next();
  }

  const token = await getCookieServer();
  //console.log(token);
  
  if(pathname.startsWith("/instagram")){
    if(!token){
      return NextResponse.redirect(new URL("/", req.url))
    }

    const isValid = await validateToken(token)
    //console.log(isValid);

    //se o token nao for valido, direciona para /
    if(!isValid){
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next();

}

//valida o token
async function validateToken(token: string){
  if (!token) return false;

  //requisição para validar o token(backend)
  try{
    await api.get("/me", {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    return true;
  }catch(err){
    //console.log(err);
    return false;
  }
}