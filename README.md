# TinyBlockChain

[![Build Status](https://travis-ci.org/leoliew/TinyBlockChain.svg?branch=master)](https://travis-ci.org/leoliew/TinyBlockChain)

## 参考视频

* https://www.savjee.be/2017/07/Writing-tiny-blockchain-in-JavaScript/

## Feature

* 简单的共识机制
* 工作量证明（proof of work）
* 校验区块链完整性 (防止篡改)
* 创建区块链钱包 (非对称加密算法)
* 签署交易

## 设计

![design image](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/leoliew/TinyBlockChain/dev/document/design.puml)

## [Demo](https://github.com/leoliew/TinyBlockchain/blob/master/src/main.ts)

#### 场景一：a1挖矿后并进行转账给a2
```
let blockChain = new Blockchain()
// Create key object
const a1 = ec.keyFromPrivate('afbdbdc791d467b34609f8022bde97a6dbbf650b086e4bf4ad745b9fcfb640f6')
const a1WalletAddress = a1.getPublic('hex')
// Create key object
const a2 = ec.keyFromPrivate('7376f678f6efc34e607af9711aa689cbdbb42ff24686a682d55716698fb63f9c')
const a2WalletAddress1 = a2.getPublic('hex')
// 1.挖矿
blockChain.minePendingTransactions(a1WalletAddress)
// 2.转账
const tx1 = new Transaction(a1WalletAddress, a2WalletAddress1, 10)
tx1.signTransaction(a1)
blockChain.addTransaction(tx1)
// 查询余额
console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(a1WalletAddress))
// 3.再次挖矿（记账）
blockChain.minePendingTransactions('b1')
console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(a1WalletAddress))
```

#### 场景二：a1尝试篡改转给a2的金额
```
let blockChain2 = new Blockchain()
// 1.挖矿
blockChain2.minePendingTransactions(a1WalletAddress)
// 2.转账
const tx2 = new Transaction(a1WalletAddress, a2WalletAddress1, 10)
tx2.signTransaction(a1)
// 3.修改金额并尝试入链
tx2.amount = 1000
blockChain2.addTransaction(tx2)
```
