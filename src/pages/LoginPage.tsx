import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/modules/auth/signin/components/login-form';

export function LoginPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
