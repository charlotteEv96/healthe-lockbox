# Health Lockbox - Secure Medical Records Management

## Project Overview

Health Lockbox is a secure, privacy-focused medical records management system built with FHE (Fully Homomorphic Encryption) technology. This application allows healthcare providers to securely store, manage, and share patient medical records while maintaining complete privacy and confidentiality.

## Features

- **Secure Medical Records Storage**: Encrypted storage of patient data using FHE
- **Privacy-Preserving Analytics**: Perform computations on encrypted data without decryption
- **Access Control**: Role-based access to medical records
- **Audit Trail**: Complete tracking of all data access and modifications
- **Blockchain Integration**: Immutable record of all transactions

## Technologies Used

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Blockchain**: Solidity, FHEVM
- **Encryption**: Fully Homomorphic Encryption (FHE)
- **Wallet Integration**: RainbowKit, MetaMask, WalletConnect

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```sh
# Clone the repository
git clone https://github.com/charlotteEv96/healthe-lockbox.git

# Navigate to the project directory
cd healthe-lockbox

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```sh
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Development

### Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── contracts/          # Smart contracts
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security

This application uses FHE technology to ensure that medical data remains encrypted even during computation. All sensitive data is encrypted at rest and in transit, providing the highest level of privacy protection.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
