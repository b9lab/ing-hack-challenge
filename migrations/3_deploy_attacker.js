module.exports = function(deployer) {
    deployer.deploy(Attacker, VulnerableBank.deployed().address);
};