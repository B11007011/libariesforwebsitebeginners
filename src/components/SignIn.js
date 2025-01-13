import { useNavigate } from 'react-router-dom';
import { handleGoogleSignIn } from '../auth/GoogleAuth';

function SignIn() {
  const navigate = useNavigate();

  const onGoogleSignIn = async () => {
    try {
      const user = await handleGoogleSignIn();
      if (user) {
        // Redirect to home/dashboard immediately after successful sign-in
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle error appropriately
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <button 
      onClick={onGoogleSignIn}
      className="sign-in-button"
    >
      Sign in with Google.com
    </button>
  );
}

export default SignIn; 