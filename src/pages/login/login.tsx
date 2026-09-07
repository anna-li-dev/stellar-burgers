import { FC, SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const error = useSelector((state) => state.user.error);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {
        // Ошибка уже записана в user.error
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
