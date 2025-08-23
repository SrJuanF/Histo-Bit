const { frontEndContractsFile, frontEndAbiLocation } = require("../helper-hardhat-config");
const fs = require("fs");
const path = require("path");

module.exports = async function (hre) {
    const { deployments, network } = hre;
    console.log("🔄 Updating frontend files...");

    if (process.env.UPDATE_FRONT_END) {
        await updateContractAddresses(deployments, network);
        await updateAbi(hre);
        console.log("✅ Frontend update complete!");
    }
};

async function updateAbi(hre) {
    const artifact = await hre.artifacts.readArtifact("DocsRecords");

    fs.mkdirSync(frontEndAbiLocation, { recursive: true });
    fs.writeFileSync(
        path.join(frontEndAbiLocation, "DocsRecords.json"),
        JSON.stringify(artifact.abi, null, 2)
    );
}

async function updateContractAddresses(deployments, network) {
    const { get } = deployments;
    const deployment = await get("DocsRecords");
    const chainId = network.config.chainId.toString();

    let currentAddresses = {};
    try {
        currentAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));
    } catch (e) {
        console.log("📁 Creating new contract address mapping file...");
    }

    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId]["DocsRecords"].includes(deployment.address)) {
            currentAddresses[chainId]["DocsRecords"].push(deployment.address);
        }
    } else {
        currentAddresses[chainId] = { DocsRecords: [deployment.address] };
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(currentAddresses, null, 2));
}

module.exports.tags = ["all", "frontend"];
