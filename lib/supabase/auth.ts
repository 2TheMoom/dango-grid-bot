import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signInWithWallet(walletAddress: string) {
  const normalized = walletAddress.toLowerCase();

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error("SignIn failed: " + error.message);
  const userId = data.user!.id;

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      { id: userId, wallet_address: normalized, auth_method: "wallet" },
      { onConflict: "id" }
    );

  if (profileError) throw new Error("Profile upsert failed: " + profileError.message);
  return data.user;
}

export async function ensureStrategy(userId: string) {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: d, error: e } = await supabase
      .from("strategies")
      .insert({ user_id: userId })
      .select()
      .single();
    if (e) throw new Error("ensureStrategy failed: " + e.message);
    return d;
  }

  if (error) throw new Error("ensureStrategy select failed: " + error.message);
  return data;
}

export async function ensureBotState(userId: string) {
  const { data, error } = await supabase
    .from("bot_states")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: d, error: e } = await supabase
      .from("bot_states")
      .insert({ user_id: userId })
      .select()
      .single();
    if (e) throw new Error("ensureBotState failed: " + e.message);
    return d;
  }

  if (error) throw new Error("ensureBotState select failed: " + error.message);
  return data;
}

export async function saveStrategy(userId: string, strategy: Record<string, any>) {
  const { error } = await supabase
    .from("strategies")
    .upsert(
      { user_id: userId, ...strategy, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) throw new Error("saveStrategy failed: " + error.message);
}

export async function updateBotState(userId: string, patch: Record<string, any>) {
  const { error } = await supabase
    .from("bot_states")
    .update({ ...patch, last_updated: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw new Error("updateBotState failed: " + error.message);
}

export async function fetchOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error("fetchOrders failed: " + error.message);
  return data;
}

export async function fetchBotState(userId: string) {
  const { data, error } = await supabase
    .from("bot_states")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw new Error("fetchBotState failed: " + error.message);
  return data;
}

export async function clearSession() {
  await supabase.auth.signOut();
}

export { supabase };
