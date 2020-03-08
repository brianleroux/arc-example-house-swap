let test = require('tape')
let sandbox = require('@architect/sandbox')
let swaps = require('../src/shared/swaps')

test('env', t=> {
  t.plan(2)
  t.ok(swaps, 'exists')
  t.ok(swaps.save, 'save')
})

let end
test('start the sandbox', async t=> {
  t.plan(1)
  end = await sandbox.start()
  t.ok(true, 'started')
})

test('cannot create a bad swap', async t=> {
  t.plan(1)
  try {
    let swap = await swaps.save({})
  }
  catch(e) {
    t.ok(e && Array.isArray(e.errors), 'caught')
    console.log(e)
  }
})

test('create a swap', async t=> {
  t.plan(1)
  await Promise.all([
    swaps.save({
      initiated: 'person1',      
      requested: 'person2', 
      initiatedHouseID: 'house1',   
      requestedHouseID: 'house2',
      state: 'initiated'
    }),
    swaps.save({
      initiated: 'person1',      
      requested: 'person3', 
      initiatedHouseID: 'house1',   
      requestedHouseID: 'house3',
      state: 'initiated'
    }),
    swaps.save({
      initiated: 'person2',      
      requested: 'person4', 
      initiatedHouseID: 'house2',   
      requestedHouseID: 'house4',
      state: 'initiated'
    }),
    swaps.save({
      initiated: 'person5',      
      requested: 'person4', 
      initiatedHouseID: 'house5',   
      requestedHouseID: 'house4',
      state: 'initiated'
    }),
  ])
  t.ok(true, 'wrote swaps')
})

test('find by accountID', async t=> {
  t.plan(3)

  let results = await swaps.find({
    initiated: 'person1',
  })
  t.ok(results.length == 2, 'got 2 results')
  console.log(results)

  let results2 = await swaps.find({
    initiated: 'person2',
  })
  t.ok(results2.length == 1, 'got 1 result')
  console.log(results2)

  let results3 = await swaps.find({
    requested: 'person4',
  })
  t.ok(results3.length == 2, 'got 2 results')
  console.log(results3)
})

// fin
test('end the sandbox', async t=> {
  t.plan(1)
  await end()
  t.ok(true, 'ended')
})
