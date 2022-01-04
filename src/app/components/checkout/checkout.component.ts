import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = []
  creditCardYears: number[] = []

  countries: Country[] = [];

  constructor(public formBuilder: FormBuilder,
    public shopFormService: ShopFormService) { }

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

    // generate credit card month options
    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )

    // generate credit card year options
    this.shopFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    // get countries list
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Countries: " +  JSON.stringify(data))
        this.countries= data
      }
    );
    
  }

  onSubmit() {
    console.log("Handling Submit: ")
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
  }

  copyAddress(event: Event) {
    if (event.target!) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      this.billingAdressStates = this.shippingAdressStates

    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAdressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
      )
    }
    
    getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    // linebellow is not needed bcz in HTMl  we added [ngValue]="country"
    // const countryObj: Country = this.countries.find(country => country.name == formGroup?.value.country)!;
    
    this.shopFormService.getStates(formGroup?.value.country.code!).subscribe(
      data =>{
        if (formGroupName === 'shippingAddress'){
          this.shippingAdressStates = data;
        }
        if (formGroupName === 'billingAddress') {
          this.billingAdressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
