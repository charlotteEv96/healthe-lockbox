import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Configure RainbowKit with multiple wallet providers
export const config = getDefaultConfig({
  appName: 'Health Lockbox',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [sepolia, mainnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Wallet connection configuration
export const walletConfig = {
  // Enable multiple wallet providers for better user experience
  wallets: [
    'rainbow',
    'metaMask',
    'coinbase',
    'walletConnect',
    'trust',
    'imToken',
    'okx',
    'zerion',
    'rabby',
    'phantom',
    'brave',
    'safe',
  ],
  // Chain configuration
  chains: [sepolia, mainnet],
  // Theme configuration
  theme: {
    lightMode: {
      accentColor: '#3b82f6',
      accentColorForeground: '#ffffff',
      borderRadius: 'medium',
    },
    darkMode: {
      accentColor: '#3b82f6',
      accentColorForeground: '#ffffff',
      borderRadius: 'medium',
    },
  },
};
