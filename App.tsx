import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
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
  const [accounts, setAccounts] = useLocalStorage<Account[]>(
    "accounts",
    DEFAULT_ACCOUNTS
  );
  const [activeAccountId, setActiveAccountId] = useLocalStorage<string>(
    "activeAccountId",
    DEFAULT_ACCOUNTS[0].id
  );
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    []
  );
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

  const activeAccount = useMemo(
    () => accounts.find((p) => p.id === activeAccountId) || accounts[0],
    [accounts, activeAccountId]
  );

  useEffect(() => {
    // If the active account is deleted, set the first account as active
    if (!accounts.find((acc) => acc.id === activeAccountId)) {
      setActiveAccountId(accounts[0]?.id || "");
    }
  }, [accounts, activeAccountId, setActiveAccountId]);

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
    (tx: Omit<Transaction, "id" | "accountId">) => {
      const newTx: Transaction = {
        ...tx,
        id: uuidv4(),
        accountId: activeAccountId,
      };
      setTransactions((prev) => [...prev, newTx]);
      addToast("Transaction added successfully!");
    },
    [activeAccountId, setTransactions, addToast]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const txToDelete = transactions.find((tx) => tx.id === id);
      if (!txToDelete) return;

      requestConfirmation(
        () => {
          setTransactions((prev) => prev.filter((tx) => tx.id !== id));
          addToast("Transaction deleted.", "error");
        },
        "Delete Transaction",
        `Are you sure you want to delete this transaction: "${txToDelete.description}"? This action cannot be undone.`
      );
    },
    [transactions, setTransactions, addToast]
  );

  const addAccount = useCallback(
    (accountData: Omit<Account, "id">) => {
      const newAccount: Account = { ...accountData, id: uuidv4() };
      setAccounts((prev) => [...prev, newAccount]);
      addToast("Account created successfully!");
    },
    [setAccounts, addToast]
  );

  const deleteAccount = useCallback(
    (id: string) => {
      if (accounts.length <= 1) {
        addToast("Cannot delete the last account.", "error");
        return;
      }
      const accToDelete = accounts.find((acc) => acc.id === id);
      if (!accToDelete) return;

      requestConfirmation(
        () => {
          setAccounts((prev) => prev.filter((acc) => acc.id !== id));
          setTransactions((prev) => prev.filter((tx) => tx.accountId !== id));
          addToast("Account deleted.", "error");
        },
        "Delete Account",
        `Are you sure you want to delete the account "${accToDelete.name}"? All associated transactions will also be deleted. This action cannot be undone.`
      );
    },
    [accounts, setAccounts, setTransactions, addToast]
  );

  const handleSetAccount = (id: string) => {
    setActiveAccountId(id);
    handleNavigation("dashboard");
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

  const seedTestData = useCallback(() => {
    if (!activeAccountId) {
      addToast("Please select an account first.", "error");
      return;
    }
    const newTestData = TEST_TRANSACTIONS.map((tx) => ({
      ...tx,
      id: uuidv4(),
      accountId: activeAccountId,
    }));
    setTransactions((prev) => [...prev, ...newTestData]);
    addToast(`${TEST_TRANSACTIONS.length} test transactions added!`);
  }, [activeAccountId, setTransactions, addToast]);

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
          onAddAccount={addAccount}
          onDeleteAccount={deleteAccount}
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
            onDelete={deleteTransaction}
          />
        );
      case "accounts":
        return (
          <AccountsPage
            accounts={accounts}
            activeAccountId={activeAccountId}
            onAddAccount={addAccount}
            onDeleteAccount={deleteAccount}
            onSetAccount={handleSetAccount}
          />
        );
      case "settings":
        return (
          <SettingsPage
            onInstallPWA={handleInstallPWA}
            installPromptAvailable={!!deferredPrompt}
            seedTestData={seedTestData}
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header activeAccount={activeAccount} />
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
