import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8083/api/products'

  private categoryUrl = 'http://localhost:8083/api/product-category'
  
  constructor(private httpClient: HttpClient) { }


  // getProductList() : Observable<Product[]> {
  //   return this.httpClient.get<Product[]>(`${this.baseUrl}`);
  // }


  getProductList(currenCategoryId: number) : Observable<Product[]> {
    //TODO: build url based of category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currenCategoryId}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }



  getProductCategories() : Observable<ProductCategory[]> {
      return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

interface GetResponseProduct{
  _embedded: {
    products: Product[]
  }
}


interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[]
  }
}
