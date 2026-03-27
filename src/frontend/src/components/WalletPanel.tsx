import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import CoinAnimation from "./CoinAnimation";

const ADMIN_USER = "प्रिंस पवन कुमार";
const CURRENT_USER = "PPK";
const FEE = 5;

interface Transaction {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  time: string;
}

const TX_KEY = "wallet_transactions";
const BALANCE_KEY = (user: string) => `wallet_${user}`;

function getBalance(user: string): number {
  return Number.parseFloat(localStorage.getItem(BALANCE_KEY(user)) || "0");
}

function setBalance(user: string, amount: number) {
  localStorage.setItem(BALANCE_KEY(user), amount.toFixed(2));
}

function loadTxs(): Transaction[] {
  try {
    const raw = localStorage.getItem(TX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTxs(txs: Transaction[]) {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface WalletPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletPanel({ open, onClose }: WalletPanelProps) {
  const [balance, setBalanceState] = useState(() => getBalance(CURRENT_USER));
  const [adminBalance, setAdminBalance] = useState(() => getBalance("admin"));
  const [transactions, setTransactions] = useState<Transaction[]>(loadTxs);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [animating, setAnimating] = useState(false);

  const handleSend = () => {
    const amt = Number.parseFloat(amount);
    if (!recipient.trim()) {
      toast.error("प्राप्तकर्ता का नाम दर्ज करें");
      return;
    }
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("सही राशि दर्ज करें");
      return;
    }
    const total = amt + FEE;
    if (balance < total) {
      toast.error(`अपर्याप्त बैलेंस। कुल ₹${total} (₹${amt} + ₹${FEE} शुल्क) चाहिए`);
      return;
    }
    setAnimating(true);
  };

  const handleAnimationComplete = () => {
    const amt = Number.parseFloat(amount);
    const total = amt + FEE;
    const newBalance = balance - total;
    const newAdminBal = adminBalance + FEE;

    setBalance(CURRENT_USER, newBalance);
    setBalance("admin", newAdminBal);
    setBalanceState(newBalance);
    setAdminBalance(newAdminBal);

    const tx: Transaction = {
      id: Date.now().toString(),
      sender: ADMIN_USER,
      recipient: recipient.trim(),
      amount: amt,
      time: nowTime(),
    };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    saveTxs(updated);

    setAnimating(false);
    setRecipient("");
    setAmount("");
    toast.success(`₹${amt} सफलतापूर्वक ${recipient.trim()} को भेजे गए!`);
  };

  const isAdmin = true; // current user is always admin (PPK)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="wallet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50"
            onClick={onClose}
          />

          <motion.div
            key="wallet-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 inset-x-0 z-[110] sm:inset-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
            style={{ height: "88vh" }}
            data-ocid="wallet.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h2 className="font-bold text-base text-foreground">
                  मेरा वॉलेट
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-ocid="wallet.close_button"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 flex flex-col gap-4">
                {/* Balance cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      मेरा बैलेंस
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{balance.toFixed(2)}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        Admin फ़ीस
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        ₹{adminBalance.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Send form */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col gap-3">
                  <h3 className="font-semibold text-sm text-foreground">
                    💸 पैसे भेजें
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="प्राप्तकर्ता का नाम"
                      className="text-sm"
                      data-ocid="wallet.recipient.input"
                    />
                    <Input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="राशि (₹)"
                      type="number"
                      min="1"
                      className="text-sm"
                      data-ocid="wallet.amount.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      ₹5 शुल्क हर लेनदेन पर लगेगा
                    </p>
                    <Button
                      onClick={handleSend}
                      disabled={animating || !recipient.trim() || !amount}
                      className="w-full"
                      data-ocid="wallet.send.primary_button"
                    >
                      {animating ? "भेज रहा है..." : "भेजें 🚀"}
                    </Button>
                  </div>
                </div>

                {/* Transaction history */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    📜 लेनदेन इतिहास
                  </h3>
                  {transactions.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="wallet.empty_state"
                    >
                      <span className="text-3xl block mb-2">🏦</span>
                      कोई लेनदेन नहीं
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {transactions.map((tx, idx) => (
                        <div
                          key={tx.id}
                          data-ocid={`wallet.item.${idx + 1}`}
                          className="bg-card border border-border rounded-lg px-3 py-2.5 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {tx.sender} → {tx.recipient}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {tx.time}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-destructive">
                            -₹{tx.amount + FEE}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </motion.div>

          {/* Coin animation overlay */}
          {animating && <CoinAnimation onComplete={handleAnimationComplete} />}
        </>
      )}
    </AnimatePresence>
  );
}
