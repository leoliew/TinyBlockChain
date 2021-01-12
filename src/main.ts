import { Transaction } from './Transaction'
import { Blockchain } from './Blockchain'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

// 场景一：a1挖矿后并进行转账给a2
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


// 场景二：a1尝试篡改转给a2的金额
let blockChain2 = new Blockchain()
// 1.挖矿
blockChain2.minePendingTransactions(a1WalletAddress)
// 2.转账
const tx2 = new Transaction(a1WalletAddress, a2WalletAddress1, 10)
tx2.signTransaction(a1)
// 3.修改金额并尝试入链
tx2.amount = 1000
blockChain2.addTransaction(tx2)
