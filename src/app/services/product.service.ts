import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8083/api/products'
  
  constructor(private httpClient: HttpClient) { }


  // getProductList() : Observable<Product[]> {
  //   return this.httpClient.get<Product[]>(`${this.baseUrl}`);
  // }


  getProductList() : Observable<Product[]> {
    return this.httpClient.get<GetResponse>(`${this.baseUrl}`).pipe(
      map(response => response._embedded.products)
    );
  }

}

interface GetResponse{
  _embedded: {
    products: Product[]
  }
}