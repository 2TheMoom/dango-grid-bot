import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signInWithWallet(walletAddress: string) {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: data.user!.id, wallet_address: walletAddress.toLowerCase(), auth_method: "wallet" });
  if (profileError) throw profileError;
  return data.user;
}

export async function ensureStrategy(userId: string) {
  const { data, error } = await supabase.from("strategies").select("*").eq("user_id", userId).single();
  if (error && error.code === "PGRST116") {
    const { data: d, error: e } = await supabase.from("strategies").insert({ user_id: userId }).select().single();
    if (e) throw e;
    return d;
  }
  if (error) throw error;
  return data;
}

export async function ensureBotState(userId: string) {
  const { data, error } = await supabase.from("bot_states").select("*").eq("user_id", userId).single();
  if (error && error.code === "PGRST116") {
    const { data: d, error: e } = await supabase.from("bot_states").insert({ user_id: userId }).select().single();
    if (e) throw e;
    return d;
  }
  if (error) throw error;
  return data;
}

export async function saveStrategy(userId: string, strategy: Record<string, any>) {
  const { error } = await supabase.from("strategies").upsert({ user_id: userId, ...strategy, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function updateBotState(userId: string, patch: Record<string, any>) {
  const { error } = await supabase.from("bot_states").update({ ...patch, last_updated: new Date().toISOString() }).eq("user_id", userId);
  if (error) throw error;
}

export async function fetchOrders(userId: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
  if (error) throw error;
  return data;
}

export async function fetchBotState(userId: string) {
  const { data, error } = await supabase.from("bot_states").select("*").eq("user_id", userId).single();
  if (error) throw error;
  return data;
}

export { supabase };
