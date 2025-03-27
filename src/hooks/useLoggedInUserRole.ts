import { useEffect, useState } from 'react';
import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

import { ADMIN_DEVELOPER_ROLE } from '@/constant/secret';
const useLoggedInUserRole = () => {
  const { instance, inProgress } = useMsal();
  const [highestRole, setHighestRole] = useState<string | null>(null);
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const account = instance.getActiveAccount();
        if (account) {
          const idToken = account.idToken;
          if (idToken) {
            const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
            const groups = decodedToken.groups || [];
            const roleHierarchy = ADMIN_DEVELOPER_ROLE;
            const highestRole = roleHierarchy.find((role) => groups.includes(role)) || 'END_USER';
            setHighestRole(highestRole);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    if (inProgress === InteractionStatus.None) {
      checkAdminStatus();
    }
  }, [inProgress, instance]);
  return { highestRole };
};
export default useLoggedInUserRole;
