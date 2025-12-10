import { supabase } from "@/integrations/supabase/client";

export type BodyType = "skinny" | "fat" | "skinny fat" | "extreme fat";
export type SkinTone = "white" | "brown" | "black" | "asian";

export interface UserProfile {
  id: string;
  height_cm: number;
  weight_kg: number;
  body_type: BodyType;
  skin_tone: SkinTone;
  created_at: string;
  updated_at: string;
}

export interface ProfileInput {
  height_cm: number;
  weight_kg: number;
  body_type: BodyType;
  skin_tone: SkinTone;
}

const USER_ID_KEY = "style_fit_user_id";

export function getStoredUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function storeUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}

export async function createProfile(input: ProfileInput): Promise<{ userId: string; profile: UserProfile }> {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      height_cm: input.height_cm,
      weight_kg: input.weight_kg,
      body_type: input.body_type,
      skin_tone: input.skin_tone,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  storeUserId(data.id);
  return { userId: data.id, profile: data as UserProfile };
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select()
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile | null;
}

export async function updateProfile(userId: string, input: ProfileInput): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      height_cm: input.height_cm,
      weight_kg: input.weight_kg,
      body_type: input.body_type,
      skin_tone: input.skin_tone,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}

export async function saveOrUpdateProfile(
  userId: string | null,
  input: ProfileInput
): Promise<{ userId: string; profile: UserProfile; isNew: boolean }> {
  if (userId) {
    const existingProfile = await getProfile(userId);
    if (existingProfile) {
      const profile = await updateProfile(userId, input);
      return { userId, profile, isNew: false };
    }
  }
  
  const result = await createProfile(input);
  return { ...result, isNew: true };
}
