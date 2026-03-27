import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProfilePageProps {
  onBack: () => void;
}

const FRIENDS = [
  { id: "f1", name: "Rahul Sharma", initials: "RS", mutual: "15 साझा मित्र" },
  { id: "f2", name: "Priya Patel", initials: "PP", mutual: "8 साझा मित्र" },
  { id: "f3", name: "Amit Verma", initials: "AV", mutual: "23 साझा मित्र" },
  { id: "f4", name: "Sunita Gupta", initials: "SG", mutual: "5 साझा मित्र" },
  { id: "f5", name: "Vikram Singh", initials: "VS", mutual: "11 साझा मित्र" },
  { id: "f6", name: "Kavita Nair", initials: "KN", mutual: "7 साझा मित्र" },
];

export default function ProfilePage({ onBack }: ProfilePageProps) {
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCover = localStorage.getItem("mk_cover_photo");
    const savedProfile = localStorage.getItem("mk_profile_photo");
    if (savedCover) setCoverPhoto(savedCover);
    if (savedProfile) setProfilePhoto(savedProfile);
  }, []);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCoverPhoto(dataUrl);
      localStorage.setItem("mk_cover_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePhoto(dataUrl);
      localStorage.setItem("mk_profile_photo", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-0" data-ocid="profile.page">
      {/* Hidden file inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverUpload}
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProfileUpload}
      />

      {/* Cover Photo */}
      <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(55% 0.12 45), oklch(42% 0.09 30), oklch(35% 0.07 25))",
              }}
            />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, oklch(85% 0.08 50) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(75% 0.10 40) 0%, transparent 40%)",
              }}
            />
          </>
        )}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm hover:bg-black/60 transition-colors"
          data-ocid="profile.upload_button"
        >
          <Camera className="w-3.5 h-3.5" />
          कवर बदलें
        </button>
      </div>

      {/* Avatar + Info */}
      <div className="bg-card border border-border rounded-b-xl px-4 pb-3 shadow-card relative">
        {/* Avatar overlapping cover */}
        <div className="relative -mt-10 mb-2 flex items-end justify-between">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-card shadow-md">
              {profilePhoto && <AvatarImage src={profilePhoto} alt="Profile" />}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                PPK
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 bg-muted border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
              data-ocid="profile.button"
            >
              <Camera className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          {/* Action buttons top-right */}
          <div className="flex gap-2 pb-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs h-7 px-3"
              data-ocid="profile.edit_button"
            >
              प्रोफ़ाइल संपादित करें
            </Button>
            <Button
              size="sm"
              className="rounded-full text-xs h-7 px-3 gap-1"
              data-ocid="profile.primary_button"
            >
              <UserPlus className="w-3.5 h-3.5" />
              मित्र जोड़ें
            </Button>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mb-2">
          <h1 className="font-bold text-xl text-foreground leading-tight">
            प्रिंस पवन कुमार
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            💰 Finance enthusiast | निवेशक | SIP lover 📈
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">523</span> मित्र
          <span className="text-border">·</span>
          <span className="font-semibold text-foreground">0</span> पोस्ट
          <span className="text-border">·</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            👑 Top Investor
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-3">
        <Tabs defaultValue="posts">
          <TabsList
            className="w-full bg-card border border-border rounded-xl shadow-card mb-3 h-9"
            data-ocid="profile.tab"
          >
            <TabsTrigger value="posts" className="flex-1 text-xs rounded-lg">
              पोस्ट
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1 text-xs rounded-lg">
              मित्र ({FRIENDS.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="flex flex-col gap-3 mt-0">
            <div
              className="bg-card rounded-xl border border-border shadow-card p-6 text-center"
              data-ocid="profile.posts.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                अभी कोई पोस्ट नहीं है
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                होम फीड से अपनी पहली पोस्ट डालें!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRIENDS.map((friend, idx) => (
                <div
                  key={friend.id}
                  className="bg-card rounded-xl border border-border shadow-card p-3 flex flex-col items-center gap-2"
                  data-ocid={`profile.friends.item.${idx + 1}`}
                >
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-base">
                      {friend.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-semibold text-xs text-foreground leading-tight">
                      {friend.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {friend.mutual}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full text-[11px] h-6 px-2"
                    data-ocid={`profile.friends.button.${idx + 1}`}
                  >
                    मित्र
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Back button for mobile */}
      <button
        type="button"
        onClick={onBack}
        className="mt-3 text-xs text-muted-foreground hover:text-foreground underline self-start"
        data-ocid="profile.link"
      >
        ← होम पर वापस जाएं
      </button>
    </div>
  );
}
