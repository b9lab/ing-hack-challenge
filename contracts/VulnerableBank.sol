pragma solidity ^0.4.0;

/**
 * @title allows inheriting contracts to selfdestruct and send remaining funds to bank-owner.
 */
contract mortal {
    /* Define variable owner of the type address*/
    address owner;

    /* this function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { 
      if (msg.sender == owner) selfdestruct(owner); 
    }
}


/**
 * @title A Transparent Decentralized Autonomous (and vulnerable) Bank.
 * **** THIS CONTRACT CONTAINS A BUG - DO NOT USE ****
 */
contract VulnerableBank is mortal {

    // Record of all balances (in wei).
    mapping (address => uint256) public userBalances;

    // Payment execution event.
    event Transfer(string message, address from, address to, uint256 amount);
    event Deposit(address from, uint256 amount);

    /**
     * @dev View the balance of the specified address.
     * @param user Address of the user.
     * @return balance The calculated perimeter.
     */
    function getBalance(address user) constant returns(uint) {  
      return userBalances[user];
    }

    /**
     * @dev Store the amount of wei sent with the message in your bank-account.
     */
    function deposit() payable {
      Deposit(msg.sender, msg.value);
      userBalances[msg.sender] += msg.value;
    }

    /**;
     * @dev Transfers the specified amount of wei from the sender's balance 
     * to the specified recipient-address.
     * @param amount The amount of wei to transfer.
     * @param to The recipients address.
     */
    function executePayment(uint256 amount, address to) payable {

        // Only allow transfers from the message sender.
        address from = msg.sender;
        //address from = tx.origin;

        if (amount > userBalances[from]) {
          Transfer("Amount greater than balance...", from, to, amount);
            
        } else { 
          if (!to.call.value(amount)()) {
            Transfer("Call.value went wrong...", from, to, amount);  
          } else {
            userBalances[from] -= amount;
            Transfer("Payment executed.", from, to, amount);
          }  
        }
    }
}