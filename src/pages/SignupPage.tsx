import { useNavigate } from 'react-router-dom';
import { SignupForm } from '@/modules/auth/signup/components/signup-form';

export function SignupPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <SignupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
