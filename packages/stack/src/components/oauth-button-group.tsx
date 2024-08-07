'use client';

import { useStackApp } from "../lib/hooks";
import { Project } from "../lib/stack-app";
import { OAuthButton } from "./oauth-button";

export function OAuthButtonGroup({
  type,
  mockProject,
}: {
  type: 'sign-in' | 'sign-up',
  mockProject?: {
    config: {
      oauthProviders: {
        id: string,
      }[],
    },
  },
}) {
  const stackApp = useStackApp();
  const project = mockProject || stackApp.useProject();
  // TODO: Shopify login is not supported currently from the frontend, hide it until it is supported
  return (
    <div className='gap-4 flex flex-col items-stretch stack-scope'>
      {project.config.oauthProviders.filter(p => p.id !== 'shopify').map(p => (
        <OAuthButton key={p.id} provider={p.id} type={type}/>
      ))}
    </div>
  );
}
