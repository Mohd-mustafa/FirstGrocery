import React, { useState } from 'react';
import './Login.css'
import LoginService from '../../Services/loginService';
import { useNavigate } from 'react-router-dom';
 
  
  const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(null)
  const navigate =useNavigate();

 
      const handleRoleBasedRedirection = (role) => {
         if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'user') {
          navigate('/user-dashboard');
        } else {
          navigate('/home'); // Default or error route
        }
      };

   
  
      const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
    
        const loginData = { email, password };
    
        try {
            const response = await LoginService.generateToken(loginData);
    
            if (response && response.token) {
                const token = response.token;
                LoginService.loginUser(token); // Store token in localStorage/sessionStorage
    
                // Fetch the user details AFTER storing the token
                const userDetails = await LoginService.getCurrentUser();
                console.log("Current User:", userDetails);
    
                if (userDetails) {
                    localStorage.setItem("user", JSON.stringify(userDetails)); // Store user
                     navigate("/user/user-dashboard");
                } else {
                    console.log("No user data received.");
                    setError("Failed to retrieve user details.");
                }
            } else {
                throw new Error("Invalid response from server.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };
    
      
    return (
        <div className='login-container'>
        <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} 
          onChange={(e)=>setEmail(e.target.value)}
          required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
        </div>
        <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                      </form>
                      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="social-login">
        <h3>Or login with</h3>
     
      </div>
      <div className='register-user'>
    <a className='register-link' href='/register'>
      New user? Register Now
    </a> </div> 
    </div>
      
</div>


    )
}
 
 export default Login