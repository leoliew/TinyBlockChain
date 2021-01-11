import { Transaction } from '../src/Transaction'

import { createSignedTx, signingKey } from './helpers'

let txObject: any

beforeEach(function () {
  txObject = new Transaction('fromAddress', 'toAddress', 9999)
})

describe('Transaction class', function () {
  describe('构造方法', function () {
    it('交易流水能够设置正确的时间戳信息', function () {
      const actual = txObject.timestamp
      const minTime = Date.now() - 1000
      const maxTime = Date.now() + 1000
      expect(actual).toBeGreaterThan(minTime)
      expect(actual).toBeLessThan(maxTime)
    })

    it('创建的交易流水信息正确', function () {
      txObject = new Transaction('a1', 'b1', 10)
      expect(txObject.fromAddress).toStrictEqual('a1')
      expect(txObject.toAddress).toStrictEqual('b1')
      expect(txObject.amount).toStrictEqual(10)
    })
  })

  describe('计算 hash', function () {
    it('可以正确计算交易流水的 SHA256', function () {
      txObject = new Transaction('a1', 'b1', 10)
      txObject.timestamp = 1
      expect(txObject.calculateHash()).toStrictEqual('21894bb7b0e56aab9eb48d4402d94628a9a179bc277542a5703f417900275153')
    })

    it('交易篡改会产生不一样的 hash', function () {
      txObject = new Transaction('a1', 'b1', 10)
      const originalHash = txObject.calculateHash()
      txObject.amount = 100
      expect(txObject.calculateHash()).not.toStrictEqual(originalHash)
    })
  })

  describe('交易是否有效', function () {
    it('未签名交易会抛出错误', function () {
      expect(() => {txObject.isValid()}).toThrow(Error)
    })

    it('可以对交易流水签名', function () {
      txObject = createSignedTx()
      console.log(txObject.signature)
      expect(txObject.signature).toStrictEqual('3044022023fb1d818a0888f7563e1a3ccdd68b28e23070d6c0c1c5004721ee1013f1d769022037da026cda35f95ef1ee5ced5b9f7d70e102fcf841e6240950c61e8f9b6ef9f8')
    })

    it('不能使用其他地址（钱包）对流水进行签名', function () {
      txObject = new Transaction('not a correct wallet key', 'wallet2', 10)
      txObject.timestamp = 1
      expect(() => {txObject.signTransaction(signingKey)}).toThrow(Error)
    })

    it('可以检测签名错误的交易', function () {
      txObject = createSignedTx()
      // Tamper with it & it should be invalid!
      txObject.amount = 100
      expect(txObject.isValid()).toStrictEqual(false)
    })

    it('正确签名，校验有效性会返回true', function () {
      txObject = createSignedTx()
      expect(txObject.isValid()).toStrictEqual(true)
    })

    it('使用空字符串签名会抛错', function () {
      txObject.signature = ''
      expect(() => {txObject.isValid()}).toThrow(Error)
    })

    it('对于挖矿奖励流水有效性校验,返回true', function () {
      txObject.fromAddress = null
      expect(txObject.isValid()).toStrictEqual(true)
    })
  })
})
