import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Target, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginPageProps {
  onGuestMode: () => void;
}

export default function LoginPage({ onGuestMode }: LoginPageProps) {
  const { login, isLoggingIn } = useInternetIdentity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const features = [
    { icon: TrendingUp, label: "वित्तीय ट्रेंड्स" },
    { icon: Users, label: "कनेक्शन बनाएं" },
    { icon: Target, label: "लक्ष्य ट्रैक करें" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-start w-1/2 bg-primary p-16 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center">
            <img
              src="/assets/uploads/1774687973872-019d33a6-946f-737e-8d66-ae825605513d-1.png"
              alt="Money Kingdom"
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-primary-foreground text-4xl font-bold leading-tight">
            आर्थिक सफलता की
            <br />
            दुनिया में आपका स्वागत है
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            मित्रों से जुड़ें, वित्तीय ज्ञान साझा करें और अपने लक्ष्य हासिल करें।
          </p>
          <div className="flex flex-col gap-4 mt-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="bg-primary-foreground/20 p-2 rounded-full">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-primary-foreground font-medium">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img
              src="/assets/uploads/1774687973872-019d33a6-946f-737e-8d66-ae825605513d-1.png"
              alt="Money Kingdom"
              className="w-20 h-20"
            />
          </div>

          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-bold text-center text-foreground">
                शुरू करें
              </h2>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login">
                <TabsList className="w-full mb-6">
                  <TabsTrigger
                    value="login"
                    className="flex-1"
                    data-ocid="auth.tab"
                  >
                    लॉगिन
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="flex-1"
                    data-ocid="auth.tab"
                  >
                    साइनअप
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="login-email">ईमेल</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="आपका ईमेल"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-ocid="login.input"
                    />
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={login}
                    disabled={isLoggingIn}
                    data-ocid="login.submit_button"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Internet Identity से लॉगिन
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onGuestMode}
                    data-ocid="login.secondary_button"
                  >
                    अतिथि के रूप में देखें
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="signup-name">नाम</Label>
                    <Input
                      id="signup-name"
                      placeholder="आपका नाम"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-ocid="signup.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="signup-email">ईमेल</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="आपका ईमेल"
                      data-ocid="signup.input"
                    />
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={login}
                    disabled={isLoggingIn}
                    data-ocid="signup.submit_button"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Internet Identity से जुड़ें
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-muted-foreground text-sm mt-6">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
