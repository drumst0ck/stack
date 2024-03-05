import { TokenSet } from "openid-client";
import { OAuthBaseProvider } from "./oauth-base";
import { OauthUserInfo, validateUserInfo } from "./utils";

export class MicrosoftProvider extends OAuthBaseProvider {
  constructor({
    clientId,
    clientSecret,
    tenantId,
  }: {
    clientId: string,
    clientSecret: string,
    tenantId: string,
  }) {
    super({
      issuer: "https://login.microsoftonline.com/" + tenantId + "/v2.0",
      authorizationEndpoint: "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/authorize",
      tokenEndpoint: "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token",
      clientId,
      clientSecret,
      redirectUri: process.env.NEXT_PUBLIC_STACK_URL + "/api/v1/auth/callback/microsoft",
      scope: "openid User.Read",
      jwksUri: "https://login.microsoftonline.com/" + tenantId + "/discovery/v2.0/keys",
      openid: true,
    });
  }

  async postProcessUserInfo(tokenSet: TokenSet): Promise<OauthUserInfo> {
    const url = new URL('https://graph.microsoft.com/v1.0/me');
    url.searchParams.append('$select', 'id,displayName,mail,identities');

    const rawUserInfo = await fetch(
      url.toString(),
      {
        headers: {
          Authorization: `Bearer ${tokenSet.access_token}`,
        },
      }
    ).then(res => res.json());

    let email = rawUserInfo.mail;
    if (!email) {
      email = rawUserInfo.identities.find((identity: any) => {
        if (identity.signInType === 'emailAddress') {
          rawUserInfo.mail = identity.issuerAssignedId;
          return true;
        }
        return false;
      });
    }

    return validateUserInfo({
      accountId: rawUserInfo.id,
      displayName: rawUserInfo.displayName,
      email: rawUserInfo.mail,
      profileImageUrl: undefined, // Microsoft Graph API does not return profile image URL
      accessToken: tokenSet.access_token,
      refreshToken: tokenSet.refresh_token,
    });
  }
}
