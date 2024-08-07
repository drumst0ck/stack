export const standardProviders = ["google", "github", "facebook", "microsoft", "spotify", "shopify"] as const;
export const sharedProviders = ["google", "github", "facebook", "microsoft", "spotify"] as const;
export const allProviders = [...standardProviders] as const; // This should be a union of standardProviders and sharedProviders

export type ProviderType = typeof allProviders[number];
export type StandardProviderType = typeof standardProviders[number];
export type SharedProviderType = typeof sharedProviders[number];
