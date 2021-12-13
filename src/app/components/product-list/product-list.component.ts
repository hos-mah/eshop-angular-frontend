import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  currenCategoryId!: number;
  previousCategoryId: number = 1;
  searchMode!: boolean;
  previousKeyword!: string;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = String(this.route.snapshot.paramMap.get('keyword'));

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;


    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword)
      .subscribe(this.processResult())
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currenCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.currenCategoryId = 1;
    }

    if(this.previousCategoryId != this.currenCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currenCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currenCategoryId)
      .subscribe(this.processResult())
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  updatePageSize(pageSizeTarget : HTMLInputElement){

    this.thePageSize = Number(pageSizeTarget.value);
    this.thePageNumber =1;
    this.listProducts();
  }

}
