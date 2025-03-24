import { useEffect, useState } from 'react';
import {
  AccountInfo,
  InteractionRequiredAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

import { loginRequest } from '@/auth/authConfig';

import ProfileData from '@/components/common/ProfileData';
import { callMsGraph } from '@/lib/MsGraphApiCall';
import { GraphData } from '@/types/common';

const Profile = () => {
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then((response) => setGraphData(response))
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            const account = instance.getActiveAccount() as AccountInfo | null;
            if (account) {
              instance.acquireTokenRedirect({
                ...loginRequest,
                account,
              });
            } else {
              console.error('No active account found');
            }
          }
        });
    }
  }, [inProgress, graphData, instance]);

  return (
    // {graphData !== null && <ProfileData graphData={graphData} />}
    <ProfileData graphData={graphData} />
  );
};
export default Profile;
