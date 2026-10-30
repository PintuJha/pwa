import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JWTObject, OktaAuth } from '@okta/okta-auth-js';
import { AuthenticationService } from './authentication.service';
const config = {
  baseUrl: 'https://YOUR_OKTA_DOMAIN/oauth2/default', // Replace with your Okta issuer
  clientId: 'YOUR_CLIENT_ID', // Replace with your Okta client ID
  redirectUri: 'http://localhost:4200/implicit/callback', // Adjust if needed
  scopes: ['openid', 'profile'] // Adjust scopes as needed
};
@Injectable({
  providedIn: 'root'
})
export class SsoOktaService {
  private oktaAuth!: OktaAuth;
  private oktaAuth1!: JWTObject;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private loginService: AuthenticationService) {
  }

  async handleCallback() {
  }
}
