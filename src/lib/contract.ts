import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract configuration
export const CONTRACT_ADDRESS = '0x...'; // Will be set after deployment
export const CONTRACT_ABI = [
  // Contract ABI will be generated after compilation
] as const;

// Create public client for reading from blockchain
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

// Create wallet client for writing to blockchain
export const createWalletClientWithAccount = (privateKey: string) => {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });
};

// Contract interaction functions
export const contractFunctions = {
  // Create a new patient record
  createPatientRecord: async (
    name: string,
    diagnosis: string,
    treatment: string,
    age: number,
    weight: number,
    height: number,
    bloodType: number,
    walletClient: any
  ) => {
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createPatientRecord',
        args: [
          name,
          diagnosis,
          treatment,
          age,
          weight,
          height,
          bloodType,
          // Additional encrypted parameters would go here
        ],
      });
      return hash;
    } catch (error) {
      console.error('Error creating patient record:', error);
      throw error;
    }
  },

  // Add a medical test
  addMedicalTest: async (
    recordId: number,
    testName: string,
    description: string,
    testType: number,
    result: number,
    isNormal: boolean,
    walletClient: any
  ) => {
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addMedicalTest',
        args: [
          recordId,
          testName,
          description,
          testType,
          result,
          isNormal,
          // Additional encrypted parameters would go here
        ],
      });
      return hash;
    } catch (error) {
      console.error('Error adding medical test:', error);
      throw error;
    }
  },

  // Add a prescription
  addPrescription: async (
    recordId: number,
    medicationName: string,
    instructions: string,
    medicationId: number,
    dosage: number,
    frequency: number,
    expiresAt: number,
    walletClient: any
  ) => {
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'addPrescription',
        args: [
          recordId,
          medicationName,
          instructions,
          medicationId,
          dosage,
          frequency,
          expiresAt,
          // Additional encrypted parameters would go here
        ],
      });
      return hash;
    } catch (error) {
      console.error('Error adding prescription:', error);
      throw error;
    }
  },

  // Grant access to a record
  grantAccess: async (
    recordId: number,
    accessor: string,
    accessType: number,
    walletClient: any
  ) => {
    try {
      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'grantAccess',
        args: [
          recordId,
          accessor,
          accessType,
          // Additional encrypted parameters would go here
        ],
      });
      return hash;
    } catch (error) {
      console.error('Error granting access:', error);
      throw error;
    }
  },

  // Get record information
  getRecordInfo: async (recordId: number) => {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getRecordInfo',
        args: [recordId],
      });
      return result;
    } catch (error) {
      console.error('Error getting record info:', error);
      throw error;
    }
  },

  // Get test information
  getTestInfo: async (testId: number) => {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTestInfo',
        args: [testId],
      });
      return result;
    } catch (error) {
      console.error('Error getting test info:', error);
      throw error;
    }
  },

  // Get prescription information
  getPrescriptionInfo: async (prescriptionId: number) => {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getPrescriptionInfo',
        args: [prescriptionId],
      });
      return result;
    } catch (error) {
      console.error('Error getting prescription info:', error);
      throw error;
    }
  },

  // Check if address is authorized doctor
  isAuthorizedDoctor: async (address: string) => {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'isAuthorizedDoctor',
        args: [address],
      });
      return result;
    } catch (error) {
      console.error('Error checking doctor authorization:', error);
      throw error;
    }
  },

  // Check if address is authorized lab
  isAuthorizedLab: async (address: string) => {
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'isAuthorizedLab',
        args: [address],
      });
      return result;
    } catch (error) {
      console.error('Error checking lab authorization:', error);
      throw error;
    }
  },
};

// Utility functions for FHE operations
export const fheUtils = {
  // Encrypt sensitive data before sending to contract
  encryptData: (data: number): string => {
    // This would use FHE encryption in a real implementation
    // For now, return a placeholder
    return `encrypted_${data}`;
  },

  // Decrypt data received from contract
  decryptData: (encryptedData: string): number => {
    // This would use FHE decryption in a real implementation
    // For now, return a placeholder
    return parseInt(encryptedData.replace('encrypted_', ''));
  },

  // Generate proof for encrypted data
  generateProof: (data: number): string => {
    // This would generate a zero-knowledge proof in a real implementation
    // For now, return a placeholder
    return `proof_${data}`;
  },
};
