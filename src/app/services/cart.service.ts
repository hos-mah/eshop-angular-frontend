import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  
  // Subject<T> extends Observable<T>
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  storage: Storage = sessionStorage;
  // storage: Storage = localStorage;

  constructor() { 
    
    // read data from storage
    const maybeItems: any = this.storage.getItem('cartItems');

    console.log('this.storage.length');
    console.log(this.storage.length );
    if(this.storage.length >0 && maybeItems != null){
      
      console.log(maybeItems);
      console.log(this.cartItems);
      let data = JSON.parse(maybeItems != null ? maybeItems : '' );

      if(data != ''){
        this.cartItems=data;
        
        // compute data based on the data that is read from storage
        this.computeCartTotals();
      }
  }
  }

  addToCart(theCartItem: CartItem){

    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;
    console.log('this.cartItems.length');
    console.log(this.cartItems.length);

    if(this.cartItems.length > 0){
      
      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);
      
      //check if item existes
      alreadyExistInCart = (existingCartItem != undefined)

      if(alreadyExistInCart){
        existingCartItem!.quantity++;
      }else{
        this.cartItems.push(theCartItem);
      }

    } else{
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for( let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // send to subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    console.log("Cart content:");
    for (const tempCart of this.cartItems) {
      const subTotalPrice = tempCart.quantity * tempCart.unitPrice;
      console.log(`name: ${tempCart.name}, quantity=${tempCart.quantity}, unitPrice=${tempCart.unitPrice}`);
    }

    console.log('---');
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity= ${totalQuantityValue.toFixed(2)}`);
    console.log('---');

  }

  decerimentQuantity(theItem: CartItem){
    theItem.quantity--;
    if(theItem.quantity === 0){
      this.remove(theItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem){
    const itemIndex = this.cartItems.indexOf(theCartItem, 0);
    console.log('itemIndex');
    console.log(itemIndex);

    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems))
  }

}
