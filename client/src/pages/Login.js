import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { useState } from "react";
import './Login.css';

const Login = () => {
    const [userInfo, setUserInfo] = useState({
        userId: '',
        token: '',
        username: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`http://localhost:3000/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: userInfo.username,
            password: userInfo.password,
        })
        });

        const data = await response.json();
        if (response.ok) {
            setUserInfo(...userInfo, { userId: data.userId, username: data.username, token: data.token });
            window.location.href = '/dashboard';
        } else {
            throw new Error(data.errors ? data.errors.map(err => err.msg).join(', ') : data.error);
        }
    } catch (err) {
        setError(err.message);
    }
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login To Your Account</h2>
                {error && <p className="error">{error}</p>}
                <label>
                    Username:
                    <input type="text" name="username" value={userInfo.username} onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={userInfo.password} onChange={handleChange} />
                </label>
                <button type="submit">Login</button>
            </form>
            <Footer />
        </div>
    );
};

export default Login;