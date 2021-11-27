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
  currenCategoryId!: number;
  
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
    
  }

  listProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
        this.currenCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    }else{
        this.currenCategoryId = 1;
    }
    
    this.productService.getProductList(this.currenCategoryId).subscribe(
        (data: any) => {
          this.products = data;
      }
    )
  }

}
