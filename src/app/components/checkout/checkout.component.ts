import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { CheckoutFormValidators } from 'src/app/validators/checkout-form-validators';

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
    public shopFormService: ShopFormService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        // Validators.email doesn't check domain (.com)
        email:  new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]), 
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        postCode: new FormControl('', [Validators.required, Validators.minLength(4), CheckoutFormValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        postCode: new FormControl('', [Validators.required, Validators.minLength(4), CheckoutFormValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}'), CheckoutFormValidators.notOnlyWhitespace]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
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

    this.readCartTotal();

  }

  readCartTotal() {

    //subscribe to subject
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressPostCode() { return this.checkoutFormGroup.get('shippingAddress.postCode'); }

  //billingAddress
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressPostCode() { return this.checkoutFormGroup.get('billingAddress.postCode'); }
  
  //creditCard
  get creditCardype() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  
  onSubmit() {
    console.log("Handling Submit: ")
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log("CheckoutFormGroup is valid: " + this.checkoutFormGroup.valid);
    
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
