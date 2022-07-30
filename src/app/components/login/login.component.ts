import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
//@ts-ignore
import OktaSignIn from '@okta/okta-signin-widget';

import appConfig from '../../config/app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(public oktaAuthService: OktaAuthService) {
    
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/village.png',
      features: {
        registeration: true
      },
      baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
      clientId: appConfig.oidc.clientId,
      redirectUri: appConfig.oidc.redirectUri,
      authParams:{
        pkce: true, // Proof Key for Code Exchange
        issuer: appConfig.oidc.issuer,
        scopes: appConfig.oidc.scopes 
      }
    });

   }

  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl(
      {el: '#okta-sign-in-widget'}, // same name as div tag id in login.component.html
      (response: { status: string; }) => {
        if(response.status === 'SUCCESS'){
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }

}
