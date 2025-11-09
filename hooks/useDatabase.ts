import { useState, useEffect, useCallback } from "react";
import { Account, Transaction } from "../types";
import {
  accountService,
  transactionService,
} from "../services/databaseService";

// Hook for managing accounts
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (accountData: Omit<Account, "id" | "created_at" | "updated_at">) => {
      try {
        const newAccount = await accountService.createAccount(accountData);
        setAccounts((prev) => [newAccount, ...prev]);
        return newAccount;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const updateAccount = useCallback(
    async (id: string, updates: Partial<Account>) => {
      try {
        const updatedAccount = await accountService.updateAccount(id, updates);
        setAccounts((prev) =>
          prev.map((acc) => (acc.id === id ? updatedAccount : acc))
        );
        return updatedAccount;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const deleteAccount = useCallback(async (id: string) => {
    try {
      await accountService.deleteAccount(id);
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    refetch: fetchAccounts,
  };
};

// Hook for managing transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = useCallback(
    async (
      transactionData: Omit<Transaction, "id" | "created_at" | "updated_at">
    ) => {
      try {
        const newTransaction = await transactionService.createTransaction(
          transactionData
        );
        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      try {
        const updatedTransaction = await transactionService.updateTransaction(
          id,
          updates
        );
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === id ? updatedTransaction : tx))
        );
        return updatedTransaction;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};

// Hook for managing transactions by account
export const useAccountTransactions = (accountId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getTransactionsByAccount(accountId);
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching account transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};
