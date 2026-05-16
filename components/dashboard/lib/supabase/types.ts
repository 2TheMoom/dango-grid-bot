export type Profile = {
  id: string;
  wallet_address: string;
  auth_method: "wallet" | "key";
  created_at: string;
};

export type Strategy = {
  id: string;
  user_id: string;
  asset: string;
  leverage: number;
  price_range_low: number;
  price_range_high: number;
  grid_levels: number;
  capital_allocation: number;
  stop_loss_threshold: number;
  updated_at: string;
};

export type BotState = {
  id: string;
  user_id: string;
  status: "idle" | "running" | "stopped" | "error";
  current_price: number | null;
  total_volume_epoch: number;
  realized_pnl: number;
  fees_paid: number;
  grid_cycles: number;
  last_updated: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_id: string;
  side: "BUY" | "SELL";
  price: number;
  size: number;
  status: "open" | "filled" | "cancelled";
  filled_at: number | null;
  pnl: number | null;
  created_at: string;
};

export type EpochReport = {
  id: string;
  user_id: string;
  epoch_number: number;
  volume: number;
  points: number;
  realized_pnl: number;
  fees_paid: number;
  lootbox_hit: boolean;
  created_at: string;
};