// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const signer = (await hre.ethers.getSigners())[0];

  const Impl1 = await hre.ethers.getContractFactory("Impl1", signer);
  const impl1 = await Impl1.deploy();
  await impl1.deployed();
  console.log(impl1.address);

  const Impl2 = await hre.ethers.getContractFactory("Impl2", signer);
  const impl2 = await Impl2.deploy();
  await impl2.deployed();
  console.log(impl2.address);

  const initData = impl1.interface.encodeFunctionData("init");

  const Proxy = await hre.ethers.getContractFactory("CustomProxy", signer);
  const proxy = await Proxy.deploy(impl1.address, initData);
  await proxy.deployed();
  console.log(proxy.address);

  const proxyIsImpl1 = impl1.attach(proxy.address);
  const proxyIsImpl2 = impl2.attach(proxy.address);

  let tx = await proxyIsImpl1.setValue(10);
  await tx.wait();

  console.log(await proxyIsImpl1.getValue());

  tx = await proxy.upgradeTo(impl2.address);
  await tx.wait();
  console.log("Proxy upgrade to impl 2");

  tx = await proxyIsImpl2.setValue(20);
  await tx.wait();
  console.log("Proxy set value to 20");

  console.log(await proxyIsImpl2.getValue());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
