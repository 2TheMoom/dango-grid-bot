import { createClient } from "./client";

const supabase = createClient();

// Sign in with wallet address using Supabase anonymous auth
// then link the wallet address to the profile
export async function signInWithWallet(walletAddress: string) {
  // Sign in anonymously first
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;

  // Upsert the wallet address into profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: data.user!.id,
      wallet_address: walletAddress.toLowerCase(),
      auth_method: "wallet",
    })
    .eq("id", data.user!.id);

  if (profileError) throw profileError;

  return data.user;
}

// Load or create default strategy for a user
export async function ensureStrategy(userId: string) {
  const { data, error } = await supabase
    .from("strategies")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // No strategy yet — create default
    const { data: newStrategy, error: insertError } = await supabase
      .from("strategies")
      .insert({ user_id: userId })
      .select()
      .single();
    if (insertError) throw insertError;
    return newStrategy;
  }

  if (error) throw error;
  return data;
}

// Load or create default bot state for a user
export async function ensureBotState(userId: string) {
  const { data, error } = await supabase
    .from("bot_states")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: newState, error: insertError } = await supabase
      .from("bot_states")
      .insert({ user_id: userId })
      .select()
      .single();
    if (insertError) throw insertError;
    return newState;
  }

  if (error) throw error;
  return data;
}

// Save strategy changes
export async function saveStrategy(userId: string, strategy: Record<string, any>) {
  const { error } = await supabase
    .from("strategies")
    .upsert({ user_id: userId, ...strategy, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
}

// Update bot state
export async function updateBotState(userId: string, patch: Record<string, any>) {
  const { error } = await supabase
    .from("bot_states")
    .update({ ...patch, last_updated: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
}

// Log an order
export async function logOrder(userId: string, order: {
  order_id: string;
  side: "BUY" | "SELL";
  price: number;
  size: number;
  status: "open" | "filled" | "cancelled";
  filled_at?: number;
  pnl?: number;
}) {
  const { error } = await supabase.from("orders").insert({ user_id: userId, ...order });
  if (error) throw error;
}

// Fetch orders for a user
export async function fetchOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

// Fetch bot state
export async function fetchBotState(userId: string) {
  const { data, error } = await supabase
    .from("bot_states")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export { supabase };