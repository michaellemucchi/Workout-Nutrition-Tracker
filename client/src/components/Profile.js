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
    const [activeTab, setActiveTab] = useState('details');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cacheBuster, setCacheBuster] = useState('');


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
    }, [user.token]);

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Only JPEG, JPG, PNG, and GIF files are allowed.');
            return;
        }

        const maxFileSize = 50 * 1024 * 1024; // 50 MB
        if (file.size > maxFileSize) {
            alert('File size should not exceed 50 MB.');
            return;
        }

        setFile(file);
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
                    profilePicture: result.profilePicture
                }));
                // Update cache-buster to force image reload
                setCacheBuster(`?t=${new Date().getTime()}`);

                // Clear file input
                setFile(null);
                document.getElementById('file-input').value = '';
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/users/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const result = await response.json();
            if (response.ok) {
                alert('Password changed successfully.');
            } else {
                throw new Error(result.error || 'Failed to change password');
            }
        } catch (error) {
            alert(error.message || 'Failed to change password');
        }
    };

    const renderContent = () => {
        const formattedDOB = profile?.date_of_birth 
            ? new Date(profile.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
            : 'N/A';
    
        switch (activeTab) {
            case 'details':
                return (
                    <>
                        <p>Bio: {profile?.bio}</p>
                        <p>Fitness Goals: {profile?.fitness_goals}</p>
                        <p>Date of Birth: {formattedDOB}</p>
                    </>
                );
            case 'change':
                return (
                    <form onSubmit={handleChangePassword} className="change-password-form">
                        <div>
                            <label>Old Password:</label>
                            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                        </div>
                        <div>
                            <label>New Password:</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <button type="submit">Change Password</button>
                    </form>
                );
            default:
                return null;
        }
    };
    
    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
            <img 
    key={cacheBuster}
    src={profile?.profilePicture ? `${profile.profilePicture}${cacheBuster}` : person} 
    alt="Profile" 
    className="profile-pic" 
/>
                <label htmlFor="file-input" className="upload-button">Select Profile Picture</label>
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
                {file && (
                    <button onClick={uploadProfilePicture} className="upload-button">Change Profile Picture</button>
                )}
                <h2>{profile?.username}</h2>
                <p>Meals Logged: {profile?.mealsLogged}</p>
                <p>Workouts Logged: {profile?.workoutsLogged}</p>
                <p>Account Age: {profile?.accountAge} days</p>
            </div>
            <div className="profile-details">
                <div className="profile-nav">
                    <button className={activeTab === 'details' ? "nav-button active" : "nav-button"}
                            onClick={() => setActiveTab('details')}>Account Details</button>
                    <button className={activeTab === 'change' ? "nav-button active" : "nav-button"}
                            onClick={() => setActiveTab('change')}>Change Information</button>
                </div>
                <div className="content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
