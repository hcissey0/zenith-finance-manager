import React from "react";
import {
  Wallet,
  ChevronDown,
  LayoutDashboard,
  History,
  Lightbulb,
  Settings,
  Plus,
  ArrowUp,
  ArrowDown,
  Scale,
  Inbox,
  Trash2,
  Send,
  User,
  Briefcase,
  School,
  Landmark,
  WalletCards,
  PiggyBank,
  CreditCard,
  Pencil,
  Check,
  Download,
  TestTube2,
  Truck,
  UtensilsCrossed,
  HandCoins,
  Receipt,
  AlertTriangle,
  Gift,
  Chrome,
  LogOut,
  X,
  Search,
} from "lucide-react";

interface IconProps {
  name: string;
  className?: string;
}

const icons: { [key: string]: React.ElementType } = {
  logo: Wallet,
  chevronDown: ChevronDown,
  dashboard: LayoutDashboard,
  transactions: History,
  insights: Lightbulb,
  settings: Settings,
  plus: Plus,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  balance: Scale,
  empty: Inbox,
  trash: Trash2,
  send: Send,
  chrome: Chrome,
  x: X,
  search: Search,
  // Account icons
  User,
  Briefcase,
  School,
  Landmark,
  wallet: Wallet,
  Wallet,
  WalletCards,
  PiggyBank,
  CreditCard,
  Pencil,
  // PWA icons
  check: Check,
  download: Download,
  // Dev icons
  dev: TestTube2,
  // Quick Log Icons
  lorry: Truck,
  food: UtensilsCrossed,
  salary: HandCoins,
  bill: Receipt,
  gift: Gift,
  alert: AlertTriangle,
  logout: LogOut,
};

const Icon: React.FC<IconProps> = ({ name, className = "h-6 w-6" }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    // Return a fallback or null
    console.warn(`Icon "${name}" not found.`);
    return <div className={className} />;
  }

  return <LucideIcon className={className} strokeWidth={1.5} />;
};

export default Icon;
