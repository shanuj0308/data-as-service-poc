import { GraphData } from '@/types/common';

const ProfileData = ({ graphData }: { graphData: GraphData | null }) => {
  return (
    <ul className='profileData'>
      <li>{graphData?.displayName}</li>
      <li>{graphData?.mail}</li>
      <li>{graphData?.businessPhones[0]}</li>
      <li>{graphData?.officeLocation}</li>
    </ul>
  );
};

export default ProfileData;
