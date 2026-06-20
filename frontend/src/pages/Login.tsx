import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = isSignup 
        ? await api.auth.signup({ email, password })
        : await api.auth.login({ email, password });
      
      setToken(data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>{isSignup ? 'Create an account' : 'Welcome back'}</h2>
      <p>Manage your AI chatbot easily.</p>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
        </div>
        
        {error && <div className="error-text mb-4">{error}</div>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Log In')}
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between" style={{ fontSize: '0.875rem' }}>
        <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
        <button 
          type="button" 
          className="btn btn-outline" 
          style={{ padding: '0.25rem 0.75rem' }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Log In' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
