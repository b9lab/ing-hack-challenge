const Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('VulnerableBank', function(accounts) {

    it("attack", function() {
        return Attacker.deployed() //           1100000000000000000
            .attack({ from: accounts[0], value: "550000000000000000", gas: 4000000 })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => {
                assert.isAtMost(receipt.gasUsed, "3999999");
                return Promise.all([
                        web3.eth.getBalancePromise(Attacker.deployed().address),
                        web3.eth.getBalancePromise(VulnerableBank.deployed().address)
                    ]);
            })
            .then(balances => {
                assert.strictEqual(balances[0].toString(10), "1650000000000000000");
                assert.strictEqual(balances[1].toString(10), "0");
                console.log("attacker", web3.fromWei(balances[0]));
                console.log("vulnerable", web3.fromWei(balances[1]));
            });
    });

});