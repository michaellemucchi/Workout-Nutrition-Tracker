import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import person from '../images/person.png';
import Loader from '../components/Loader'; 
import './Profile.css';
const Profile = () => {
    const { user } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                console.log('Fetched profile data:', data); // Debug: Log fetched data
                if (response.ok) {
                    setProfile(data);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const uploadProfilePicture = async () => {
        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const response = await fetch('http://localhost:3000/api/users/profile/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${user.token}` 
                },
            });
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                setProfile(prevState => ({
                    ...prevState,
                    profilePicture: result.profilePicture  // Updating state with new profile picture URL
                }));
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <Loader />; 
    if (error) return <div>Error: {error}</div>;


    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <img src={profile?.profilePicture ? profile.profilePicture : person} alt="Profile" />
                <input type="file" onChange={handleFileChange} />
                <button onClick={uploadProfilePicture}>Upload Picture</button>
                <h2>{profile?.username}</h2>
                <p>Meals Logged: {profile?.mealsLogged}</p>
                <p>Workouts Logged: {profile?.workoutsLogged}</p>
                <p>Account Age: {profile?.accountAge} days</p>
            </div>
        </div>
    );
};

export default Profile;
