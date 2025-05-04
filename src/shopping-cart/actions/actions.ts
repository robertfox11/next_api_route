// 'use client'
/*
cookie: cart
{
  'uui-123-1': 4,
  'uui-123-2': 1,
  'uui-123-3': 2,
}
*/
import { getCookie, hasCookie, setCookie } from "cookies-next";


export const getCookieCart = ():{ [id: string]:number } => {

  if ( hasCookie('cart') ) {
    //si existe en la cookie cart obtenemos un json si no devuelve un objeto vacio
    const cookieCart = JSON.parse( getCookie('cart') as string ?? '{}' );
    return cookieCart;
  }

  return {};
}

export const addProductToCart = ( id: string ) => {
    //agreggar un producto a este objeto
  const cookieCart = getCookieCart();

  if ( cookieCart[id] ) {
    //si existe en la cookie cart suma mas uno
    cookieCart[id] = cookieCart[id] + 1;
  } else {
    cookieCart[id] = 1;
  }
  // guardamos en la cookie
  setCookie('cart', JSON.stringify(cookieCart));
}

export const removeProductFromCart = ( id:string ) =>{
  const cookieCart = getCookieCart();//obtenemos el id de las cookies
  delete cookieCart[id]; //elimimamos el producto
  setCookie('cart', JSON.stringify(cookieCart));
}

export const removeSingleItemFromCart = ( id: string ) => {
  //tomar el carro de la cookies
  const cookieCart = getCookieCart();
  if ( !cookieCart[id] ) return;//si no tenemos en la cookie cart no hay nada que hacer
  const itemsInCart = cookieCart[id] - 1;//si el car es menos -1

  if ( itemsInCart <= 0 ) {
    delete cookieCart[id]; //eliminamos el elemento 
  } else {
    cookieCart[id] = itemsInCart;// si actualizamos el valor el elemento 
  }

  setCookie('cart', JSON.stringify(cookieCart));
}