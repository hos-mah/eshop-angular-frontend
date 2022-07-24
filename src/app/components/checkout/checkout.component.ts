import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        // Validators.email doesn't check domain (.com)
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(4), CheckoutFormValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CheckoutFormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(4), CheckoutFormValidators.notOnlyWhitespace])
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
        console.log("Countries: " + JSON.stringify(data))
        this.countries = data
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

  //customer
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  //shippingAddress
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressPostCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  //billingAddress
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressPostCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  //creditCard
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  onSubmit() {
    console.log("Handling Submit: ")
    // if any field is invalid trigger the display of error messages for all the invalid fields 
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log("CheckoutFormGroup is valid: " + this.checkoutFormGroup.valid);

    // setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get card items
    const cartItems = this.cartService.cartItems;

    //create orderItems
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    //setup purchase
    let purchase = new Purchase();
    //populate purchase: customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase: shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    purchase.shippingAddress!.country = shippingCountry?.name;
    purchase.shippingAddress!.state = shippingState?.name;

    //populate purchase: billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    purchase.billingAddress!.country = billingCountry?.name;
    purchase.billingAddress!.state = billingState?.name;

    //populate purchase: order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your Order has been received. \ntracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => alert(`There was an error: ${err.message}`)
      }
    );
  }

  resetCart(){
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form
    this.checkoutFormGroup.reset();

    //navigate to products
    this.router.navigateByUrl("/products");
  }

  copyAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      this.billingAdressStates = this.shippingAdressStates;
      

    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAdressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    // linebellow is not needed bcz in HTMl  we added [ngValue]="country"
    // const countryObj: Country = this.countries.find(country => country.name == formGroup?.value.country)!;

    this.shopFormService.getStates(formGroup?.value.country.code!).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
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
