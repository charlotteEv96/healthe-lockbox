import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Wallet, User } from 'lucide-react';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to access secure medical records management
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <ConnectButton />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Supported wallets:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge variant="secondary">MetaMask</Badge>
              <Badge variant="secondary">Rainbow</Badge>
              <Badge variant="secondary">Coinbase</Badge>
              <Badge variant="secondary">WalletConnect</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle>Wallet Connected</CardTitle>
        <CardDescription>
          Your wallet is securely connected to Health Lockbox
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => disconnect()}
          className="w-full"
        >
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
};
