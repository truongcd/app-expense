import { Category } from './types';

export const CATEGORIES: Category[] = [
  Category.Food,
  Category.Transport,
  Category.Rent,
  Category.Utilities,
  Category.Entertainment,
  Category.Health,
  Category.Shopping,
  Category.Other,
];

export const CATEGORY_COLORS: { [key in Category]: string } = {
  [Category.Food]: '#4ade80', // Tailwind green-400
  [Category.Transport]: '#60a5fa', // Tailwind blue-400
  [Category.Rent]: '#f87171', // Tailwind red-400
  [Category.Utilities]: '#facc15', // Tailwind yellow-400
  [Category.Entertainment]: '#c084fc', // Tailwind purple-400
  [Category.Health]: '#fb923c', // Tailwind orange-400
  [Category.Shopping]: '#22d3ee', // Tailwind cyan-400
  [Category.Other]: '#9ca3af', // Tailwind gray-400
};
