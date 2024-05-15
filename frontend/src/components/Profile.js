import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../apiService';

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile().then(response => {
      setProfile(response.data);
    });
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
    </div>
  );
}

export default Profile;
