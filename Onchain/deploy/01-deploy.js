const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log("----------------------------------------------------")

    const docsRecords = await deploy("DocsRecords", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name)) {
        log("Verifying...")
        await verify(docsRecords.address, [])
    }
}

module.exports.tags = ["all", "DocsRecords"]

//https://testnet.snowtrace.io/address/0x5eDc321228e8064a678d16df4338d77cc38Dc6e5


/*
git add . && \
rm -rf Graphs/docs-records/.git && \
git rm --cached -rf Graphs/docs-records && \
rm -rf histo-bit-frontend/.git && \
git rm --cached -rf histo-bit-frontend && \
git add Graphs/docs-records && \
git add histo-bit-frontend && \
git commit -m "First Commit"
git push -u origin main// origin main

git remote set-url origin https://github.com/usuario/repositorio2.git
git push -u origin ma
*/