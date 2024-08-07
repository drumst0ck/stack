'use client';

import { useUser } from "@stackframe/stack";
import { Button, Input } from "@stackframe/stack-ui";
import { useState } from "react";

export default function Page() {
  const user = useUser({ or: 'redirect' });
  const [token, setToken] = useState<string | null>(null);
  const [shopId, setShopId] = useState<string>("");

  return (
    <div>
      <div>
        ShopId:
        <Input value={shopId} onChange={e => setShopId(e.target.value)} />
      </div>

      <Button onClick={() => {
        user.getConnectedAccount('shopify', { or: 'redirect', shopifyShopId: shopId }).then(connection => {
          connection.getAccessToken().then(token => {
            setToken(token.accessToken);
          }).catch(err => console.error(err));
        }).catch(err => console.error(err));
      }}>
        Get Token
      </Button>

      {token && (
        <div>
          Token: {token}
        </div>
      )}
    </div>
  );
}
