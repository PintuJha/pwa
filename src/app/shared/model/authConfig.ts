import { AuthConfig } from "angular-oauth2-oidc";

export const authConfig: AuthConfig = {
    issuer: 'https://mothersongroup.okta.com',
    redirectUri: '',
    clientId: '0oadzx0i5l4ayI7vX697',
    scope: 'openid profile email',
    showDebugInformation: true,
    sessionChecksEnabled: true,
    timeoutFactor: 0.01,
    oidc: true,
    requestAccessToken: true,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
};

