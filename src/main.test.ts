import { Block, BlockChain,Transaction } from "./main"


test('block chain', () => {
  let blockChain = new BlockChain()
  blockChain.createTransaction(new Transaction('address1','address2',100))
  blockChain.createTransaction(new Transaction('address2','address1',50))


  // 尝试修改区块
  // blockChain.chain[1].data = JSON.stringify({amount: 100})

  console.log('Starting the miner...')

  blockChain.minePendingTransactions('address3')


  console.log('Balance of address3 is',blockChain.getBalanceOfAddress('address3'))



  console.log('Starting the miner again...')

  blockChain.minePendingTransactions('address3')

  console.log('Balance of address1 is',blockChain.getBalanceOfAddress('address2'))
  console.log('Balance of address2 is',blockChain.getBalanceOfAddress('address2'))
  console.log('Balance of address3 is',blockChain.getBalanceOfAddress('address3'))
  // expect(blockChain.isChainValid()).toEqual(false)
})
