import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  type BodyType,
  type SkinTone,
  type ProfileInput,
  type UserProfile,
  getProfileByUserId,
  saveOrUpdateProfile,
} from "@/lib/profile-api";
import { Loader2, RefreshCw, Sparkles, User, LogOut } from "lucide-react";

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: "skinny", label: "Skinny" },
  { value: "fat", label: "Fat" },
  { value: "skinny fat", label: "Skinny Fat" },
  { value: "extreme fat", label: "Extreme Fat" },
];

const SKIN_TONES: { value: SkinTone; label: string }[] = [
  { value: "white", label: "White" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "asian", label: "Asian" },
];

export function ProfileForm() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<UserProfile | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | "">("");
  const [skinTone, setSkinTone] = useState<SkinTone | "">("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  async function loadExistingProfile() {
    if (!user) return;
    setIsLoading(true);
    try {
      const profile = await getProfileByUserId(user.id);
      if (profile) {
        setExistingProfile(profile);
        setHeightCm(profile.height_cm.toString());
        setWeightKg(profile.weight_kg.toString());
        setBodyType(profile.body_type);
        setSkinTone(profile.skin_tone);
        setShowUpdatePrompt(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function validateInput(): ProfileInput | null {
    const height = parseInt(heightCm);
    const weight = parseInt(weightKg);

    if (isNaN(height) || height < 30 || height > 300) {
      toast({
        title: "Invalid Height",
        description: "Height must be between 30 and 300 cm",
        variant: "destructive",
      });
      return null;
    }

    if (isNaN(weight) || weight < 2 || weight > 500) {
      toast({
        title: "Invalid Weight",
        description: "Weight must be between 2 and 500 kg",
        variant: "destructive",
      });
      return null;
    }

    if (!bodyType) {
      toast({
        title: "Body Type Required",
        description: "Please select your body type",
        variant: "destructive",
      });
      return null;
    }

    if (!skinTone) {
      toast({
        title: "Skin Tone Required",
        description: "Please select your skin tone",
        variant: "destructive",
      });
      return null;
    }

    return {
      height_cm: height,
      weight_kg: weight,
      body_type: bodyType,
      skin_tone: skinTone,
    };
  }

  async function handleSave() {
    if (!user) return;
    
    const input = validateInput();
    if (!input) return;

    setIsSaving(true);
    try {
      const result = await saveOrUpdateProfile(user.id, input);
      
      setExistingProfile(result.profile);
      setShowUpdatePrompt(true);

      toast({
        title: result.isNew ? "Profile Created ✔" : "Profile Updated ✔",
        description: result.isNew 
          ? "Your style & fit profile has been saved!" 
          : "Your changes have been saved!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate("/auth", { replace: true });
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {showUpdatePrompt && existingProfile && (
        <Card className="mb-6 border-primary/20 bg-primary/5 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Welcome back!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We found your existing profile. Any changes in your body? Update your measurements below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-border/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 rounded-2xl gradient-hero w-fit shadow-glow">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">Style & Fit Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Help us understand your body for better style recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                min={30}
                max={300}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                min={2}
                max={500}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body-type" className="text-sm font-medium">
              Body Type
            </Label>
            <Select value={bodyType} onValueChange={(v) => setBodyType(v as BodyType)}>
              <SelectTrigger id="body-type" className="h-12 bg-background">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {BODY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skin-tone" className="text-sm font-medium">
              Skin Tone
            </Label>
            <Select value={skinTone} onValueChange={(v) => setSkinTone(v as SkinTone)}>
              <SelectTrigger id="skin-tone" className="h-12 bg-background">
                <SelectValue placeholder="Select skin tone" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {SKIN_TONES.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : existingProfile ? (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Update Profile
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Save Profile
                </>
              )}
            </Button>

            {existingProfile && (
              <p className="text-xs text-center text-muted-foreground">
                Last updated: {new Date(existingProfile.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-6 px-4">
        This is NOT a medical tool. Data is used solely for style and fit recommendations.
      </p>
    </div>
  );
}
