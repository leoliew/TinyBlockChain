import { Transaction } from './Transaction'
import { Blockchain } from './Blockchain'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

// 场景一：myKey挖矿后并进行转账给myKey1
let blockChain = new Blockchain()
// Create key object
const myKey = ec.keyFromPrivate('afbdbdc791d467b34609f8022bde97a6dbbf650b086e4bf4ad745b9fcfb640f6')
const myWalletAddress = myKey.getPublic('hex')
// Create key object
const myKey1 = ec.keyFromPrivate('7376f678f6efc34e607af9711aa689cbdbb42ff24686a682d55716698fb63f9c')
const myWalletAddress1 = myKey1.getPublic('hex')
// 1.挖矿
blockChain.minePendingTransactions(myWalletAddress)
// 2.转账
const tx1 = new Transaction(myWalletAddress, myWalletAddress1, 10)
tx1.signTransaction(myKey)
blockChain.addTransaction(tx1)
// 查询余额
console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(myWalletAddress))
// 3.再次挖矿（记账）
blockChain.minePendingTransactions('xxx')
console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(myWalletAddress))
