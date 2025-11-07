import { Account, Transaction } from "./types";

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "p1",
    name: "Personal",
    currency: "USD",
    icon: "User",
    color: "bg-blue-500",
  },
  {
    id: "p2",
    name: "Business",
    currency: "USD",
    icon: "Briefcase",
    color: "bg-green-500",
  },
  {
    id: "p3",
    name: "School",
    currency: "EUR",
    icon: "School",
    color: "bg-yellow-500",
  },
];

export const DEFAULT_CATEGORIES = {
  income: [
    "Salary",
    "Business Revenue",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ],
  expense: [
    "Food & Groceries",
    "Housing & Rent",
    "Utilities",
    "Transportation",
    "Health & Wellness",
    "Entertainment",
    "Shopping",
    "Education",
    "Business Expense",
    "Taxes",
    "Gift",
    "Other",
  ],
};

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, "0");

export const TEST_TRANSACTIONS: Omit<Transaction, "id" | "accountId">[] = [
  {
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly Salary",
    date: `${year}-${month}-01`,
  },
  {
    type: "expense",
    amount: 1200,
    category: "Housing & Rent",
    description: "Rent Payment",
    date: `${year}-${month}-01`,
  },
  {
    type: "expense",
    amount: 85.5,
    category: "Food & Groceries",
    description: "Weekly Groceries",
    date: `${year}-${month}-03`,
  },
  {
    type: "expense",
    amount: 45.2,
    category: "Transportation",
    description: "Gasoline",
    date: `${year}-${month}-04`,
  },
  {
    type: "expense",
    amount: 150,
    category: "Health & Wellness",
    description: "Gym Membership",
    date: `${year}-${month}-05`,
  },
  {
    type: "income",
    amount: 300,
    category: "Freelance",
    description: "Web design project",
    date: `${year}-${month}-06`,
  },
  {
    type: "expense",
    amount: 75.8,
    category: "Entertainment",
    description: "Dinner with friends",
    date: `${year}-${month}-07`,
  },
  {
    type: "expense",
    amount: 200,
    category: "Shopping",
    description: "New shoes",
    date: `${year}-${month}-08`,
  },
  {
    type: "expense",
    amount: 55,
    category: "Utilities",
    description: "Internet Bill",
    date: `${year}-${month}-10`,
  },
  {
    type: "expense",
    amount: 32.5,
    category: "Food & Groceries",
    description: "Lunch",
    date: `${year}-${month}-12`,
  },
  {
    type: "expense",
    amount: 25,
    category: "Entertainment",
    description: "Movie tickets",
    date: `${year}-${month}-14`,
  },
  {
    type: "income",
    amount: 50,
    category: "Gift",
    description: "Birthday gift from grandma",
    date: `${year}-${month}-15`,
  },
];
