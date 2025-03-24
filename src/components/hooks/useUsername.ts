import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';

function useUsername() {
  const { instance } = useMsal();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const account = instance.getActiveAccount();
    if (account) {
      setUsername(account.username);
    }
  }, [instance]);

  return username;
}

export default useUsername;
