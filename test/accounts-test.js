let test = require('tape')
let sandbox = require('@architect/sandbox')
let accounts = require('../src/shared/accounts')

test('env', t=> {
  t.plan(3)
  t.ok(accounts, 'exists')
  t.ok(accounts.find, 'find')
  t.ok(accounts.save, 'save')
})

let end
test('start the sandbox', async t=> {
  t.plan(1)
  end = await sandbox.start()
  t.ok(true, 'started')
})

test('can create an account', async t=> {
  t.plan(1)
  let account = await accounts.save({
    accountID: 'fake',
    name: 'brian'
  })
  t.ok(account.name === 'brian', 'created')
  console.log(account)
})

test('can lookup account by accountID', async t=> {
  t.plan(1)
  let account = await accounts.find('fake')
  t.ok(account.name === 'brian', 'found')
  console.log(account)
})

test('can update an account', async t=> {
  t.plan(1)
  let account = await accounts.save({
    accountID: 'fake',
    name: 'Brian'
  })
  t.ok(account.name === 'Brian', 'updated')
  console.log(account)
})

test('end the sandbox', async t=> {
  t.plan(1)
  await end()
  t.ok(true, 'ended')
})
