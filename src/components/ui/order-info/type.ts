import { TIngredient } from '@utils-types';

export type OrderInfoUIProps = {
  orderInfo: TOrderInfo;
};

type TOrderInfo = {
  ingredientsInfo: {
    [key: string]: TIngredient & { count: number };
  };
  date: Date;
  total: number;
  _id: string;
  status: string;
  name: string;
  created_at: string;
  updated_at: string;
  number: number;
  ingredients: string[];
};
