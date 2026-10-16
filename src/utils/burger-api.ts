import {
  TIngredient,
  TOrder,
  TAuthResponse,
  TUserResponse
} from '@utils-types';

const BURGER_API_URL = 'https://practicetasks.kz/burger-constructor';
type IngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};
type RefreshResponse = {
  success: boolean;
  access_token: string;
  refresh_token: string;
};

export type TCreateOrderResponse = {
  success: boolean;
  name: string;
  order: TOrder;
};
export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${BURGER_API_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  return response.json();
}

export async function refreshUserToken(refreshToken: string) {
  return request<RefreshResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: refreshToken
    })
  });
}
export const getIngredients = async () =>
  request<IngredientsResponse>('/ingredients');

export async function loginUser(email: string, password: string) {
  return request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
}
export async function forgotPassword(email: string) {
  return request<{ success: boolean }>('/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  });
}
export async function resetPassword(password: string, token: string) {
  return request<{ success: boolean }>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password,
      token
    })
  });
}
export async function updateUser(
  accessToken: string,
  userData: { name: string; email: string; password?: string }
) {
  return request<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken
    },
    body: JSON.stringify(userData)
  });
}
export async function getUser(accessToken: string) {
  return request<TUserResponse>('/auth/user', {
    headers: {
      Authorization: accessToken
    }
  });
}

export async function logoutUser(refreshToken: string) {
  return request<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: refreshToken })
  });
}

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  return request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      name
    })
  });
}

export async function createOrder(
  ingredients: string[],
  accessToken: string
): Promise<TCreateOrderResponse> {
  const token = accessToken.startsWith('Bearer ')
    ? accessToken
    : `Bearer ${accessToken}`;

  return request<TCreateOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      ingredients
    })
  });
}

export type TOrdersResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrderResponse = {
  success: boolean;
  orders: TOrder[];
};

export const getFeedOrders = () => request<TOrdersResponse>('/orders/all');

export const getUserOrders = (accessToken: string) =>
  request<{ success: boolean; orders: TOrder[] }>('/orders', {
    headers: {
      Authorization: accessToken.startsWith('Bearer ')
        ? accessToken
        : `Bearer ${accessToken}`
    }
  });
export const getOrderByNumber = (number: number) =>
  request<TOrderResponse>(`/orders/${number}`);
