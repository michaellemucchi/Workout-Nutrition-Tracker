import React, { useState } from 'react';
import { changeUserPassword } from '../apiService';

function ChangePassword() {
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    changeUserPassword({ password }).then(response => {
      alert('Password changed successfully!');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        New Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Change Password</button>
    </form>
  );
}

export default ChangePassword;
