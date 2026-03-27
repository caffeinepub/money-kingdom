import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { playFollowSound } from "@/utils/sounds";
import { Plus, Target } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface SuggestedUser {
  id: string;
  name: string;
  initials: string;
  bio: string;
  followed: boolean;
}

interface Goal {
  id: string;
  label: string;
  progress: number;
  target: string;
}

const TRENDING_TOPICS = [
  { tag: "#Bitcoin", count: "12.4K" },
  { tag: "#RealEstate", count: "8.9K" },
  { tag: "#Stocks", count: "7.2K" },
  { tag: "#MutualFunds", count: "5.6K" },
  { tag: "#Gold", count: "4.1K" },
];

const INITIAL_USERS: SuggestedUser[] = [
  {
    id: "1",
    name: "Deepak Mehta",
    initials: "DM",
    bio: "Stock Market Expert",
    followed: false,
  },
  {
    id: "2",
    name: "Kavita Nair",
    initials: "KN",
    bio: "Crypto Enthusiast",
    followed: false,
  },
  {
    id: "3",
    name: "Arjun Reddy",
    initials: "AR",
    bio: "Real Estate Investor",
    followed: false,
  },
];

const INITIAL_GOALS: Goal[] = [
  { id: "1", label: "इमरजेंसी फंड", progress: 75, target: "₹5 लाख" },
  { id: "2", label: "घर खरीदना", progress: 32, target: "₹50 लाख" },
  { id: "3", label: "Retirement", progress: 18, target: "₹2 करोड़" },
];

export default function RightSidebar() {
  const [users, setUsers] = useState<SuggestedUser[]>(INITIAL_USERS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [newGoal, setNewGoal] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);

  const handleToggleFollow = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          if (!u.followed) {
            playFollowSound();
          }
          toast.success(
            u.followed ? `${u.name} को अनफॉलो किया` : `${u.name} को फॉलो किया`,
          );
          return { ...u, followed: !u.followed };
        }
        return u;
      }),
    );
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: newGoal.trim(),
        progress: 0,
        target: "₹1 लाख",
      },
    ]);
    setNewGoal("");
    setShowGoalForm(false);
    toast.success("नया लक्ष्य जोड़ा गया!");
  };

  return (
    <div className="sticky top-16 flex flex-col gap-3">
      {/* Suggested Connections */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-1.5 pt-3 px-3">
          <CardTitle className="text-xs font-bold text-foreground">
            सुझाए गए कनेक्शन
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 flex flex-col gap-2">
          {users.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2"
              data-ocid={`suggestions.item.${idx + 1}`}
            >
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[11px] text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.bio}
                </p>
              </div>
              <Button
                size="sm"
                variant={user.followed ? "outline" : "default"}
                className={`text-[11px] rounded-full px-2.5 h-6 shrink-0 ${
                  user.followed
                    ? ""
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                onClick={() => handleToggleFollow(user.id)}
                data-ocid={`suggestions.toggle.${idx + 1}`}
              >
                {user.followed ? "फॉलोइंग" : "फॉलो"}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Trending Finance Topics */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-1.5 pt-3 px-3">
          <CardTitle className="text-xs font-bold text-foreground">
            ट्रेंडिंग वित्त विषय
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {TRENDING_TOPICS.map((t, idx) => (
              <button
                type="button"
                key={t.tag}
                data-ocid={`trending.tab.${idx + 1}`}
                className="group flex items-center gap-1"
              >
                <Badge
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-[11px] px-2 py-0.5"
                >
                  {t.tag}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-1.5 pt-3 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold text-foreground">
              वित्तीय लक्ष्य
            </CardTitle>
            <button
              type="button"
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="p-0.5 rounded-full hover:bg-muted transition-colors"
              data-ocid="goals.open_modal_button"
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3 flex flex-col gap-2">
          {showGoalForm && (
            <div className="flex gap-1.5" data-ocid="goals.panel">
              <Input
                className="text-xs rounded-lg h-7"
                placeholder="नया लक्ष्य..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                data-ocid="goals.input"
              />
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-2.5 h-7 text-xs"
                onClick={handleAddGoal}
                data-ocid="goals.submit_button"
              >
                जोड़ें
              </Button>
            </div>
          )}

          {goals.map((goal, idx) => (
            <div
              key={goal.id}
              className="flex flex-col gap-1"
              data-ocid={`goals.item.${idx + 1}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-foreground">
                    {goal.label}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-primary">
                  {goal.progress}%
                </span>
              </div>
              <Progress value={goal.progress} className="h-1" />
              <p className="text-[10px] text-muted-foreground">
                लक्ष्य: {goal.target}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
