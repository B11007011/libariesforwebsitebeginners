import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../services/auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/home');
    } catch (error: any) {
      setError(error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-8">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full max-w-md mb-4 p-3 border rounded-lg hover:bg-gray-50"
      >
        <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
        Sign {isSignUp ? 'up' : 'in'} with Google
      </button>

      <div className="my-4 text-center w-full max-w-md">
        <span className="px-4 text-gray-500">or</span>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          required
        />
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
} 