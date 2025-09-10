import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying HealthLockbox contract...');

  // Get the contract factory
  const HealthLockbox = await ethers.getContractFactory('HealthLockbox');

  // Deploy the contract with a verifier address (you can change this)
  const verifierAddress = '0x742d35Cc6b2aE52B4...8F8E'; // Replace with actual verifier address
  const healthLockbox = await HealthLockbox.deploy(verifierAddress);

  await healthLockbox.waitForDeployment();

  const contractAddress = await healthLockbox.getAddress();
  console.log('HealthLockbox deployed to:', contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifierAddress,
    deployedAt: new Date().toISOString(),
    network: 'sepolia',
  };

  console.log('Deployment completed successfully!');
  console.log('Contract Address:', contractAddress);
  console.log('Verifier Address:', verifierAddress);
  console.log('Deployment Time:', deploymentInfo.deployedAt);

  return deploymentInfo;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
