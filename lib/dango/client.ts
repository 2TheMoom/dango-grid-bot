import { createPublicClient, createTransport, mainnet } from "@left-curve/sdk";

const MAINNET_URL = "https://rpc.dango.exchange";

let _publicClient: ReturnType<typeof createPublicClient> | null = null;

export function getPublicClient() {
  if (_publicClient) return _publicClient;
  _publicClient = createPublicClient({
    chain: mainnet,
    transport: createTransport(MAINNET_URL),
  });
  return _publicClient;
}

export { mainnet };
