import {
  ConstructorPage,
  Login,
  Register,
  ResetPassword,
  ForgotPassword,
  Feed,
  Profile,
  ProfileOrders
} from '@pages';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getUserThunk, checkAuth } from '../../services/slices/authSlice';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';
import { AppHeader, IngredientDetails, OrderInfo } from '@components';

const App = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    dispatch(fetchIngredients());
    if (accessToken) {
      dispatch(getUserThunk(accessToken));
    } else {
      dispatch(checkAuth());
    }
  }, [dispatch, accessToken]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
