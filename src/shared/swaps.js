let arc = require('@architect/functions')

module.exports = { save, find }

/** 
 * save a swap
 */
async function save(params) {
  validate(params)
  let data = await arc.tables()
  return data.swaps.put(params)
}

/**
 * find swaps
 */
async function find(params) {

  let data = await arc.tables()

  if (params.initiated) {
    let result = await data.swaps.query({ 
      KeyConditionExpression: `#initiated = :initiated`,
      ExpressionAttributeNames: {
        '#initiated': 'initiated'
      },
      ExpressionAttributeValues: {
        ':initiated': params.initiated
      }
    })
    return result.Items
  }

  if (params.requested) {
    let result = await data.swaps.query({ 
      IndexName: 'requested-index',
      KeyConditionExpression: `#requested = :requested`,
      ExpressionAttributeNames: {
        '#requested': 'requested'
      },
      ExpressionAttributeValues: {
        ':requested': params.requested
      }
    })
    return result.Items
  }

  throw SyntaxError('invalid params; only initiated or requested supported')
}

/**
 * validate the swap payload
 */
function validate(params) {

  let required = [
    'initiated',        // accountID of the person initiating the swap
    'requested',        // accountID of the person being requestd to swap
    'initiatedHouseID',   
    'requestedHouseID',
    'state'
  ]
  let states = [
    'initiated',
    'accepted',
    'cancelled',
    'rejected'
  ]

  let errors = []
  for (let prop of required)
    if (!params[prop])
      errors.push(`missing prop: "${prop}"`)

  if (params && params.state && states.includes(params.state) === false)
    errors.push(`invalidate state: "${params.state}"; must be one of: ${states.join(', ')}`)

  if (errors.length > 0) {
    let err = SyntaxError('bad swap')
    err.errors = errors
    throw err
  }
}
