import { supabase } from "../lib/supabase";
import { Account, Transaction } from "../types";

// Account operations
export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAccount(
    account: Omit<Account, "id" | "created_at" | "updated_at">
  ): Promise<Account> {
    console.log({ account });
    console.log("Create account called");

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Add user_id to the account data
    const accountWithUserId = {
      ...account,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from("accounts")
      .insert(accountWithUserId)
      .select()
      .single();
    console.log({ data, error });

    if (error) throw error;
    return data;
  },

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const { data, error } = await supabase
      .from("accounts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase.from("accounts").delete().eq("id", id);

    if (error) throw error;
  },
};

// Transaction operations
export const transactionService = {
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map database fields to frontend types
    return (data || []).map((tx) => ({
      id: tx.id,
      accountId: tx.account_id,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
    }));
  },

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("account_id", accountId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map database fields to frontend types
    return (data || []).map((tx) => ({
      id: tx.id,
      accountId: tx.account_id,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
    }));
  },

  async createTransaction(
    transaction: Omit<Transaction, "id">
  ): Promise<Transaction> {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Map frontend types to database fields
    const dbTransaction = {
      user_id: user.id,
      account_id: transaction.accountId,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(dbTransaction)
      .select()
      .single();

    if (error) throw error;

    // Map back to frontend type
    return {
      id: data.id,
      accountId: data.account_id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      date: data.date,
      description: data.description,
    };
  },

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> {
    // Map frontend types to database fields
    const dbUpdates: any = {};
    if (updates.accountId) dbUpdates.account_id = updates.accountId;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.amount) dbUpdates.amount = updates.amount;
    if (updates.date) dbUpdates.date = updates.date;
    if (updates.description) dbUpdates.description = updates.description;

    const { data, error } = await supabase
      .from("transactions")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Map back to frontend type
    return {
      id: data.id,
      accountId: data.account_id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      date: data.date,
      description: data.description,
    };
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) throw error;
  },
};

// Profile operations
export const profileService = {
  async getProfile(): Promise<any> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(updates: any): Promise<any> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
