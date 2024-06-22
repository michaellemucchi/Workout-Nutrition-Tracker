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
        if (file) {
            // Check the file size (e.g., 5MB maximum)
            if (file.size > 52428800) {
                alert('File size must not exceed 5MB');
                return;
            }
    
            // Check the file type
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Only JPEG and PNG files are allowed');
                return;
            }
    
            setFile(file);
        }
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
                    profile_picture: result.profile_picture  // Updating state with new profile picture URL
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
                {console.log(profile)}
                <img src={profile?.profile_picture ? profile?.profile_picture : person} alt="Profile" />
                <input type="file" onChange={handleFileChange} accept="image/jpeg, image/png" />
                {file && (  // Check if file is not null to display the button
                    <button onClick={uploadProfilePicture}>Upload Picture</button>
                )}
                <h2>{profile?.username}</h2>
                <p>Meals Logged: {profile?.mealsLogged}</p>
                <p>Workouts Logged: {profile?.workoutsLogged}</p>
                <p>Account Age: {profile?.accountAge} days</p>
            </div>
        </div>
    );
};

export default Profile;
