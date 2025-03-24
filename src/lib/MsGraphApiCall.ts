import { graphConfig, loginRequest } from '@/auth/authConfig';

import { msalInstance } from '@/context/auth-provider';

export async function callMsGraph(accessToken: string = '') {
  if (!accessToken) {
    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
      throw Error(
        'No active account! Verify a user has been signed in and setActiveAccount has been called.',
      );
    }

    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    });
    accessToken = response.accessToken;
  }

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
