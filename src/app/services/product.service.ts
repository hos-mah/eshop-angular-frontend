import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.eshopBaseUrl + '/products'

  private categoryUrl = environment.eshopBaseUrl + '/product-category'

  constructor(private httpClient: HttpClient) { }


  getProduct(theProductId: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }


  getProductList(currenCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${currenCategoryId}`;
    return this.getProducts(searchUrl);
  }



  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${keyword}`;
    return this.getProducts(searchUrl);

  }


  searchProductsPaginate(thePage: number,
    thePageSize: number,
    keyword: string): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContainingIgnoreCase?name=${keyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProduct> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
      console.log(`Getting products from: ${url}`);
    return this.httpClient.get<GetResponseProduct>(url);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
