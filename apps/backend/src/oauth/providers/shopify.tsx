import { OAuthBaseProvider, TokenSet } from "./base";
import { OAuthUserInfo, validateUserInfo } from "../utils";
import { getEnvVariable } from "@stackframe/stack-shared/dist/utils/env";

export class ShopifyProvider extends OAuthBaseProvider {
  private constructor(
    public readonly shopId: string,
    ...args: ConstructorParameters<typeof OAuthBaseProvider>
  ) {
    super(...args);
  }

  static async create(options: {
    shopId: string,
    clientId: string,
    clientSecret: string,
  }) {
    return new ShopifyProvider(
      options.shopId,
      ...await OAuthBaseProvider.createConstructorArgs({
        issuer: `https://${options.shopId}.myshopify.com`,
        authorizationEndpoint: `https://${options.shopId}.myshopify.com/admin/oauth/authorize`,
        tokenEndpoint: `https://${options.shopId}.myshopify.com/admin/oauth/access_token`,
        redirectUri: getEnvVariable("STACK_BASE_URL") + "/api/v1/auth/oauth/callback/shopify",
        baseScope: "",
        ...options,
      }));
  }

  async postProcessUserInfo(tokenSet: TokenSet): Promise<OAuthUserInfo> {
    const rawUserInfo = await fetch(`https://${this.shopId}.myshopify.com/admin/api/2024-01/users/current.json`, {
      headers: {
        "X-Shopify-Access-Token": `${tokenSet.accessToken}`,
      },
    }).then((res) => res.json());

    return validateUserInfo({
      accountId: rawUserInfo.id,
      displayName: rawUserInfo.first_name + " " + rawUserInfo.last_name,
      email: rawUserInfo.email,
    });
  }
}
