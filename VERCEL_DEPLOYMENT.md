# Vercel Deployment Guide for Health Lockbox

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare all necessary environment variables

## Step-by-Step Deployment Instructions

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `charlotteEv96/healthe-lockbox`
4. Select the repository and click "Import"

### Step 2: Configure Project Settings

#### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in Vercel dashboard:

```bash
# Blockchain Configuration
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_CONTRACT_ADDRESS=0x...
VITE_VERIFIER_ADDRESS=0x...

# Wallet Configuration
VITE_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID

# API Configuration
VITE_API_BASE_URL=https://api.healthlockbox.com

# Security Configuration
VITE_ENCRYPTION_KEY=your_encryption_key_here

# Development Configuration
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### Step 3: Domain Configuration

#### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate to be issued

#### Default Vercel Domain
- Your app will be available at: `https://healthe-lockbox.vercel.app`
- You can customize the subdomain in project settings

### Step 4: Build Configuration

#### Vercel Configuration File
Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 5: Deployment Process

1. **Automatic Deployment**: 
   - Every push to main branch triggers automatic deployment
   - Preview deployments for pull requests

2. **Manual Deployment**:
   - Go to Deployments tab
   - Click "Redeploy" for latest commit

3. **Build Logs**:
   - Monitor build process in Vercel dashboard
   - Check for any build errors or warnings

### Step 6: Post-Deployment Configuration

#### Environment Variables Verification
1. Verify all environment variables are set correctly
2. Test wallet connection functionality
3. Verify blockchain network connectivity

#### Performance Optimization
1. Enable Vercel Analytics (optional)
2. Configure Edge Functions if needed
3. Set up monitoring and alerts

### Step 7: Security Configuration

#### HTTPS and Security Headers
Vercel automatically provides:
- HTTPS encryption
- Security headers
- DDoS protection

#### Additional Security Measures
1. Set up Content Security Policy (CSP)
2. Configure CORS settings
3. Implement rate limiting if needed

### Step 8: Monitoring and Maintenance

#### Analytics
1. Enable Vercel Analytics for performance monitoring
2. Set up error tracking (Sentry integration)
3. Monitor Core Web Vitals

#### Updates
1. Push changes to GitHub for automatic deployment
2. Use Vercel CLI for local development: `vercel dev`
3. Preview deployments for testing

## Important Configuration Parameters

### Build Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Environment Variables (Critical)
- `VITE_SEPOLIA_RPC_URL`: Sepolia testnet RPC endpoint
- `VITE_CONTRACT_ADDRESS`: Deployed contract address
- `VITE_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID
- `VITE_VERIFIER_ADDRESS`: Contract verifier address

### Network Configuration
- **Primary Network**: Sepolia Testnet
- **Fallback Network**: Localhost (for development)
- **Wallet Support**: MetaMask, Rainbow, Coinbase, WalletConnect

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable naming (must start with VITE_)
   - Verify no typos in variable names

3. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID
   - Check network configuration
   - Ensure contract address is correct

4. **Performance Issues**:
   - Enable Vercel Analytics
   - Optimize bundle size
   - Use Vercel Edge Functions if needed

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [WalletConnect Documentation](https://docs.walletconnect.com/)

## Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] Build successful
- [ ] Wallet connection working
- [ ] Contract interaction functional
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Monitoring enabled

## Post-Deployment Testing

1. **Functionality Tests**:
   - Wallet connection
   - Contract interactions
   - Data encryption/decryption
   - User interface responsiveness

2. **Performance Tests**:
   - Page load times
   - Bundle size analysis
   - Core Web Vitals

3. **Security Tests**:
   - HTTPS enforcement
   - Security headers
   - Data encryption verification

Your Health Lockbox application should now be successfully deployed on Vercel!
