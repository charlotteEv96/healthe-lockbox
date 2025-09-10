import { Shield, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-medical shadow-medical">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">FHE Health Data Security</h1>
              <p className="text-xs text-white/80">Fully Homomorphic Encryption</p>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="hidden md:flex items-center space-x-4">
          <Badge variant="secondary" className="bg-security-gold text-white border-0">
            <Lock className="mr-1 h-3 w-3" />
            End-to-End Encrypted
          </Badge>
          <div className="text-white/90 text-sm">
            <span className="font-medium">Status:</span> Secure Connection
          </div>
        </div>

        {/* Wallet Component */}
        <div className="flex items-center space-x-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};