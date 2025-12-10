import { supabase } from "@/integrations/supabase/client";

export type BodyType = "skinny" | "fat" | "skinny fat" | "extreme fat";
export type SkinTone = "white" | "brown" | "black" | "asian";

export interface UserProfile {
  id: string;
  user_id: string;
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

export async function getAuthenticatedUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function createProfile(userId: string, input: ProfileInput): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      user_id: userId,
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

  return data as UserProfile;
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select()
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile | null;
}

export async function updateProfileByUserId(userId: string, input: ProfileInput): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      height_cm: input.height_cm,
      weight_kg: input.weight_kg,
      body_type: input.body_type,
      skin_tone: input.skin_tone,
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}

export async function saveOrUpdateProfile(
  userId: string,
  input: ProfileInput
): Promise<{ profile: UserProfile; isNew: boolean }> {
  const existingProfile = await getProfileByUserId(userId);
  
  if (existingProfile) {
    const profile = await updateProfileByUserId(userId, input);
    return { profile, isNew: false };
  }
  
  const profile = await createProfile(userId, input);
  return { profile, isNew: true };
}
