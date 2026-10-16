import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await forgotPassword(email);
      if (response.success) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Не удалось отправить запрос на восстановление пароля')
      );
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
