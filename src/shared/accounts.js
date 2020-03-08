let arc = require('@architect/functions')

module.exports = { save, find }

async function find(accountID) {
  let data = await arc.tables()
  return data.accounts.get({ accountID })
}

async function save(props) {
  let data = await arc.tables()
  return data.accounts.put(props)
}
