import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/auth/Auth";
import {
  useAccounts,
  useTransactions,
  useAccountTransactions,
} from "./hooks/useDatabase";
import {
  Transaction,
  Account,
  Page,
  QuickLogType,
  TransactionType,
} from "./types";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_ACCOUNTS,
  TEST_TRANSACTIONS,
} from "./constants";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import Dashboard from "./components/dashboard/Dashboard";
import TransactionList from "./components/transactions/TransactionList";
import AccountsPage from "./components/insights/AiInsights";
import SettingsPage from "./components/settings/SettingsPage";
import TransactionForm from "./components/transactions/TransactionForm";
import { Toaster, ToastMessage } from "./components/ui/Toaster";
import { v4 as uuidv4 } from "uuid";
import QuickLogModal from "./components/transactions/QuickLogModal";
import ConfirmationModal from "./components/ui/ConfirmationModal";

const pages: Page[] = ["dashboard", "transactions", "accounts", "settings"];

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAccountId, setActiveAccountId] = useState<string>("");

  // Database hooks
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts();

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [quickLogType, setQuickLogType] = useState<QuickLogType | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // State for swipe navigation and animations
  const [animationDirection, setAnimationDirection] = useState<
    "left" | "right" | null
  >(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session:", session, "Error:", error);
      console.log(
        "localStorage auth token:",
        localStorage.getItem("supabase.auth.token")
      );
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, "Session:", session);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      }
      if (data.session) {
        console.log("Session restored from callback:", data.session);
        setSession(data.session);
      }
    };

    // Check if we're returning from OAuth
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes("access_token") || search.includes("code")) {
      console.log("Detected OAuth callback, processing...");
      handleAuthCallback();
    }
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = uuidv4();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3000);
    },
    []
  );

  const requestConfirmation = (
    onConfirm: () => void,
    title: string,
    message: string
  ) => {
    setConfirmationState({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleConfirm = () => {
    if (confirmationState.onConfirm) {
      confirmationState.onConfirm();
    }
    setConfirmationState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleCancelConfirm = () => {
    setConfirmationState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleNavigation = (page: Page, direction?: "left" | "right") => {
    const currentIndex = pages.indexOf(currentPage);
    const newIndex = pages.indexOf(page);

    if (currentIndex === newIndex) return;

    if (direction) {
      setAnimationDirection(direction);
    } else {
      if (newIndex > currentIndex) {
        setAnimationDirection("left");
      } else if (newIndex < currentIndex) {
        setAnimationDirection("right");
      } else {
        setAnimationDirection(null);
      }
    }

    setCurrentPage(page);
    if (window.location.hash !== `/${page}`) {
      window.location.hash = `/${page}`;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null); // Reset on new touch
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const diffX = touchStartX - touchEndX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    const currentIndex = pages.indexOf(currentPage);

    // Swiped left
    if (diffX > swipeThreshold) {
      if (currentIndex < pages.length - 1) {
        const nextIndex = currentIndex + 1;
        handleNavigation(pages[nextIndex], "left");
      }
    }

    // Swiped right
    if (diffX < -swipeThreshold) {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        handleNavigation(pages[prevIndex], "right");
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "");
      if (
        ["dashboard", "transactions", "accounts", "settings"].includes(hash)
      ) {
        // Avoid animation on browser back/forward
        setAnimationDirection(null);
        setCurrentPage(hash as Page);
      } else {
        setCurrentPage("dashboard");
        window.location.hash = "/dashboard";
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const isLoading = loading || accountsLoading || transactionsLoading;
  const hasError = accountsError || transactionsError;

  const activeAccount = useMemo(
    () => accounts.find((acc) => acc.id === activeAccountId) || accounts[0],
    [accounts, activeAccountId]
  );

  useEffect(() => {
    // Set active account when accounts are loaded
    if (accounts.length > 0 && !activeAccountId) {
      setActiveAccountId(accounts[0].id);
    }
  }, [accounts, activeAccountId]);

  useEffect(() => {
    // If the active account is deleted, set the first account as active
    if (
      accounts.length > 0 &&
      !accounts.find((acc) => acc.id === activeAccountId)
    ) {
      setActiveAccountId(accounts[0].id);
    }
  }, [accounts, activeAccountId]);

  const activeTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.accountId === activeAccountId)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [transactions, activeAccountId]
  );

  const addTransaction = useCallback(
    async (tx: Omit<Transaction, "id" | "accountId">) => {
      try {
        await createTransaction({
          ...tx,
          accountId: activeAccountId,
        });
        addToast("Transaction added successfully!");
      } catch (error) {
        addToast("Failed to add transaction", "error");
      }
    },
    [activeAccountId, createTransaction, addToast]
  );

  const handleDeleteTransaction = useCallback(
    (id: string) => {
      const txToDelete = transactions.find((tx) => tx.id === id);
      if (!txToDelete) return;

      requestConfirmation(
        async () => {
          try {
            await deleteTransaction(id);
            addToast("Transaction deleted.", "error");
          } catch (error) {
            addToast("Failed to delete transaction", "error");
          }
        },
        "Delete Transaction",
        `Are you sure you want to delete this transaction: "${txToDelete.description}"? This action cannot be undone.`
      );
    },
    [transactions, deleteTransaction, addToast]
  );

  const addAccountHandler = useCallback(
    async (accountData: Omit<Account, "id">) => {
      try {
        await createAccount(accountData);
        addToast("Account created successfully!");
      } catch (error) {
        addToast("Failed to create account", "error");
      }
    },
    [createAccount, addToast]
  );

  const handleDeleteAccount = useCallback(
    (id: string) => {
      if (accounts.length <= 1) {
        addToast("Cannot delete the last account.", "error");
        return;
      }
      const accToDelete = accounts.find((acc) => acc.id === id);
      if (!accToDelete) return;

      requestConfirmation(
        async () => {
          try {
            await deleteAccount(id);
            addToast("Account deleted.", "error");
          } catch (error) {
            addToast("Failed to delete account", "error");
          }
        },
        "Delete Account",
        `Are you sure you want to delete the account "${accToDelete.name}"? All associated transactions will also be deleted. This action cannot be undone.`
      );
    },
    [accounts, deleteAccount, addToast]
  );

  const handleSetAccount = (id: string) => {
    setActiveAccountId(id);
    handleNavigation("dashboard");
  };

  const handleAuthSuccess = () => {
    // Auth component will handle navigation
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      addToast("App installed successfully!");
    }
    setDeferredPrompt(null);
  };

  const seedTestData = useCallback(async () => {
    if (!activeAccountId) {
      addToast("Please select an account first.", "error");
      return;
    }

    try {
      // Add test transactions to the database
      const testTransactions = TEST_TRANSACTIONS.map((tx) => ({
        ...tx,
        accountId: activeAccountId,
      }));

      for (const tx of testTransactions) {
        await createTransaction(tx);
      }

      addToast(`${TEST_TRANSACTIONS.length} test transactions added!`);
    } catch (error) {
      addToast("Failed to add test data", "error");
    }
  }, [activeAccountId, createTransaction, addToast]);

  const handleQuickLogSubmit = useCallback(
    (data: any) => {
      if (!quickLogType) return;

      let description = "";
      let category = "";
      let type: TransactionType = "expense";
      const amount = parseFloat(data.amount);

      if (isNaN(amount) || amount <= 0) {
        addToast("Invalid amount.", "error");
        return;
      }

      switch (quickLogType) {
        case "lorry":
          description = `Lorry Fare: ${data.from} to ${data.to}`;
          category = "Transportation";
          type = "expense";
          break;
        case "food":
          description = `Food: ${data.item}`;
          category = "Food & Groceries";
          type = "expense";
          break;
        case "salary":
          description = `Salary from ${data.source}`;
          category = "Salary";
          type = "income";
          break;
        case "bill":
          description = `Bill: ${data.for}`;
          category = "Utilities";
          type = "expense";
          break;
        case "gift-in":
          description = `Gift from ${data.from}`;
          category = "Gift";
          type = "income";
          break;
        case "gift-out":
          description = `Gift to ${data.to}`;
          category = "Gift";
          type = "expense";
          break;
        case "charity":
          description = `Charity Donation to ${data.to}`;
          category = "Charity";
          type = "expense";
          break;
        default:
          return;
      }

      addTransaction({
        type,
        amount,
        category,
        description,
        date: new Date().toISOString().split("T")[0],
      });
      setQuickLogType(null);
    },
    [quickLogType, addTransaction, addToast]
  );

  const renderPage = () => {
    if (!activeAccount && currentPage !== "settings") {
      return (
        <AccountsPage
          accounts={accounts}
          activeAccountId={activeAccountId}
          onAddAccount={addAccountHandler}
          onDeleteAccount={handleDeleteAccount}
          onSetAccount={handleSetAccount}
        />
      );
    }
    switch (currentPage) {
      case "transactions":
        return (
          <TransactionList
            transactions={activeTransactions}
            currency={activeAccount.currency}
            onDelete={handleDeleteTransaction}
          />
        );
      case "accounts":
        return (
          <AccountsPage
            accounts={accounts}
            activeAccountId={activeAccountId}
            onAddAccount={addAccountHandler}
            onDeleteAccount={handleDeleteAccount}
            onSetAccount={handleSetAccount}
          />
        );
      case "settings":
        return (
          <SettingsPage
            onInstallPWA={handleInstallPWA}
            installPromptAvailable={!!deferredPrompt}
            seedTestData={seedTestData}
            onSignOut={handleSignOut}
            user={session?.user}
          />
        );
      case "dashboard":
      default:
        return (
          <Dashboard
            transactions={activeTransactions}
            currency={activeAccount.currency}
            onQuickLog={setQuickLogType}
            onAddTransaction={() => setIsTxModalOpen(true)}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading Zenith Finance...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header
        activeAccount={activeAccount}
        user={session?.user}
        onSignOut={handleSignOut}
      />
      <main
        className="flex-grow overflow-y-auto overflow-x-hidden pb-28"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          key={currentPage}
          className={`px-4 sm:px-6 lg:px-8 ${
            animationDirection === "left"
              ? "animate-slide-in-left"
              : animationDirection === "right"
              ? "animate-slide-in-right"
              : ""
          }`}
        >
          {renderPage()}
        </div>
      </main>
      <BottomNav
        activePage={currentPage}
        onNavigate={handleNavigation}
        onAdd={() => setIsTxModalOpen(true)}
      />
      {isTxModalOpen && activeAccount && (
        <TransactionForm
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onSubmit={addTransaction}
          categories={DEFAULT_CATEGORIES}
          currency={activeAccount.currency}
        />
      )}
      {quickLogType && activeAccount && (
        <QuickLogModal
          isOpen={!!quickLogType}
          onClose={() => setQuickLogType(null)}
          onSubmit={handleQuickLogSubmit}
          type={quickLogType}
          currency={activeAccount.currency}
        />
      )}
      <Toaster toasts={toasts} />
      {confirmationState.isOpen && (
        <ConfirmationModal
          isOpen={confirmationState.isOpen}
          onClose={handleCancelConfirm}
          onConfirm={handleConfirm}
          title={confirmationState.title}
          message={confirmationState.message}
        />
      )}
    </div>
  );
};

export default App;
