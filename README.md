# ING hack challenge
1 Ether lying there to be taken.

Original contract: https://github.com/Ceesvanwijk/vulnerable-bank/

At: https://etherscan.io/address/0x59752433dbe28f5aa59b479958689d353b3dee08

Attacked by: https://etherscan.io/address/0x5cb073d82d28e76d38c21908fcd213c5cea3a20d

```javascript
> vulnerableAddress = "0x59752433dbe28f5aa59b479958689d353b3dee08";
> web3.eth.getBalance(vulnerableAddress, 3160800);
1100000000000000000
> web3.eth.getBalance(vulnerableAddress, 3160801);
0

> attackerAddress = "0x5cb073d82d28e76d38c21908fcd213c5cea3a20d";
> web3.eth.getBalance(attackerAddress, 3160800);
0
> web3.eth.getBalance(attackerAddress, 3160801);
1650000000000000000
```

