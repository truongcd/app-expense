
export enum Category {
  Food = 'Ăn uống',
  Transport = 'Di chuyển',
  Rent = 'Nhà ở',
  Utilities = 'Tiện ích',
  Entertainment = 'Giải trí',
  Health = 'Sức khoẻ',
  Shopping = 'Mua sắm',
  Other = 'Khác',
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string; // ISO 8601 format: YYYY-MM-DD
}
