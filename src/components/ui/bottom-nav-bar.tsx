"use client";

import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  Home,
  LineChart,
  CreditCard,
  MessageCircle,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number | string; strokeWidth?: number; className?: string; "aria-hidden"?: boolean }>;
  onClick?: () => void;
  badge?: number | string;
};

const defaultNavItems: NavItem[] = [
  { label: "Home", icon: Home },
  { label: "Portfolio", icon: LineChart },
  { label: "Transactions", icon: CreditCard },
  { label: "Messages", icon: MessageCircle },
  { label: "Rewards", icon: Trophy },
  { label: "Profile", icon: User },
];

const MOBILE_LABEL_WIDTH = 72;

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  activeIndex?: number;
  stickyBottom?: boolean;
  items?: NavItem[];
  onItemSelect?: (index: number, item: NavItem) => void;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  stickyBottom = false,
  items = defaultNavItems,
  onItemSelect,
}: BottomNavBarProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalActiveIndex;

  const handleSelect = (idx: number, item: NavItem) => {
    if (controlledIndex === undefined) {
      setInternalActiveIndex(idx);
    }
    if (item.onClick) {
      item.onClick();
    }
    if (onItemSelect) {
      onItemSelect(idx, item);
    }
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-card/95 backdrop-blur-md dark:bg-card border border-border dark:border-sidebar-border rounded-full flex items-center p-1.5 sm:p-2 shadow-2xl space-x-1 min-w-[320px] max-w-[95vw] h-[52px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "flex items-center gap-0 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors duration-200 relative h-10 min-w-[42px] sm:min-w-[44px] min-h-[40px] max-h-[44px]",
              isActive
                ? "bg-primary/10 dark:bg-primary/15 text-primary dark:text-primary gap-1.5 sm:gap-2 shadow-inner"
                : "bg-transparent text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-muted hover:text-primary",
              "focus:outline-none focus-visible:ring-0",
            )}
            onClick={() => handleSelect(idx, item)}
            aria-label={item.label}
            type="button"
          >
            <div className="relative flex items-center justify-center">
              <Icon
                size={21}
                strokeWidth={2}
                aria-hidden
                className="transition-colors duration-200"
              />
              {item.badge !== undefined && Boolean(item.badge) && (
                <span className="absolute -top-1.5 -right-2 bg-[#FFC928] text-[#183D2B] text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-1 ring-white">
                  {item.badge}
                </span>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.19 },
                marginLeft: { duration: 0.19 },
              }}
              className={cn("overflow-hidden flex items-center max-w-[76px]")}
            >
              <span
                className={cn(
                  "font-bold text-xs whitespace-nowrap select-none transition-opacity duration-200 overflow-hidden text-ellipsis text-[clamp(0.65rem,0.55rem+0.5vw,0.85rem)] leading-tight",
                  isActive ? "text-primary dark:text-primary" : "opacity-0",
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
