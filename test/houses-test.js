let test = require('tape')
let sandbox = require('@architect/sandbox')
let houses = require('../src/shared/houses')

test('env', t=> {
  t.plan(3)
  t.ok(houses, 'exists')
  t.ok(houses.save, 'save')
  t.ok(houses.find, 'find')
})

let end
test('start the sandbox', async t=> {
  t.plan(1)
  end = await sandbox.start()
  t.ok(true, 'started')
})

test('cannot create a bad house', async t=> {
  t.plan(1)
  try {
     let house = await houses.save({})
  }
  catch(e) {
    t.ok(e && Array.isArray(e.notfound), 'caught')
    console.log(e)
  }
})

let houseID // used below
test('create a house', async t=> {
  t.plan(1)
  let house = await houses.save({
    accountID: 'fake1',
    country: 'CA',
    administrative_area: 'BC',
    locality: 'Vancouver',
    postal_code: 'V6A0A5',
    thoroughfare: '22 East Cordova St.',
    premise: '#33',
  })
  t.ok(house, 'house')
  houseID = house.houseID
  console.log(house)
})

test('find by accountID', async t=> {
  t.plan(1)
  let house = await houses.find({
    accountID: 'fake1',
  })
  t.ok(house, 'house')
  console.log(house)
})

test('find by houseID', async t=> {
  t.plan(1)
  let house = await houses.find({ houseID })
  t.ok(house, 'house')
  console.log(house)
})

test('find by locality', async t=> {
  t.plan(2)
  await Promise.all([
    houses.save({
      accountID: 'fake1',
      country: 'CA',
      administrative_area: 'BC',
      locality: 'Vancouver',
      postal_code: 'V6A0A5',
      thoroughfare: '23 East Cordova St.',
      premise: '#44',
    }),
    houses.save({
      accountID: 'fake1',
      country: 'CA',
      administrative_area: 'BC',
      locality: 'Vancouver',
      postal_code: 'V6A0A5',
      thoroughfare: '24 East Cordova St.',
      premise: '#443',
    }),
    houses.save({
      accountID: 'fake1',
      country: 'CA',
      administrative_area: 'BC',
      locality: 'Whistler',
      postal_code: 'V6A0A5',
      thoroughfare: 'Cold Ass Way',
      premise: '#420',
    }),
  ])

  let all = await houses.find({ beginsWith: 'CA-BC' })
  t.ok(all.length === 4, 'all four')

  let van = await houses.find({ beginsWith: 'CA-BC-Vancouver' })
  t.ok(van.length === 3, 'only three in van')
})

// fin
test('end the sandbox', async t=> {
  t.plan(1)
  await end()
  t.ok(true, 'ended')
})
