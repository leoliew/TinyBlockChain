import { Block, BlockChain } from "./main"


test('block chain', () => {
  let blockChain = new BlockChain()
  const block1 = new Block(1, new Date().getTime(), JSON.stringify({amount:4}), blockChain.getLatestBlock().hash)
  const block2 = new Block(2, new Date().getTime(), JSON.stringify({amount:5}), blockChain.getLatestBlock().hash)
  // const block3 = new Block(3, new Date().getTime(), JSON.stringify({amount:5}), blockChain.getLatestBlock().hash)
  blockChain.addBlock(block1)
  blockChain.addBlock(block2)
  // blockChain.addBlock(block3)
  expect(blockChain.isChainValid()).toEqual(true)
  // 尝试修改区块
  blockChain.chain[1].data = JSON.stringify({amount: 100})

  expect(blockChain.isChainValid()).toEqual(false)
})
