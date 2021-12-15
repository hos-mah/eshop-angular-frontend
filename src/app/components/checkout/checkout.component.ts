import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  constructor(public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['']
      }),
      shippingAddress: this.formBuilder.group({
      country: [''],
      state: [''],
      city: [''],
      street: [''],
      posteCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city: [''],
        street: [''],
        posteCode: ['']
        }),
        creditCard: this.formBuilder.group({
          cardType: [''],
          nameOnCard: [''],
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
          })
    })
  }

  onSubmit(){
    console.log("Handling Submit: ")
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAdress')?.value);
  }

  copyAddress(event: Event){
    if(event.target!){
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }
}
