// import { Block, BlockChain } from "./main"
import { Transaction } from "./Transaction"
import { BlockChain } from "./BlockChain"
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

// test('block chain', () => {
// Create new instance of Blockchain class
let blockChain = new BlockChain()


// Create key object
const myKey = ec.keyFromPrivate('afbdbdc791d467b34609f8022bde97a6dbbf650b086e4bf4ad745b9fcfb640f6')
const myWalletAddress = myKey.getPublic('hex')


// Create key object
const myKey1 = ec.keyFromPrivate('7376f678f6efc34e607af9711aa689cbdbb42ff24686a682d55716698fb63f9c')
const myWalletAddress1 = myKey1.getPublic('hex')

// Make a transaction
const tx1 = new Transaction(myWalletAddress, myWalletAddress1, 10)
tx1.signTransaction(myKey)
blockChain.addTransaction(tx1)

// Mine block
blockChain.minePendingTransactions(myWalletAddress)


console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(myWalletAddress)); // 0

// 尝试修改区块
// blockChain.chain[1].data = JSON.stringify({amount: 100})

// console.log('Starting the miner...')

// blockChain.minePendingTransactions('address3')


// console.log('Balance of address3 is',blockChain.getBalanceOfAddress('address3'))


// console.log('Starting the miner again...')

// blockChain.minePendingTransactions(myWalletAddress)

// console.log('Balance of address1 is',blockChain.getBalanceOfAddress('address2'))
// console.log('Balance of address2 is',blockChain.getBalanceOfAddress('address2'))
// console.log('Balance of address3 is',blockChain.getBalanceOfAddress('address3'))
// console.log('Balance of myWallet is', blockChain.getBalanceOfAddress(myWalletAddress)) // 90

// expect(blockChain.isChainValid()).toEqual(true)
// })
