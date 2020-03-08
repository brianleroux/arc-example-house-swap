let arc = require('@architect/functions')

module.exports = { save, find }

/**
 * validates a house
 *
 * @param {object} props
 * @param {string} props.accountID           - owner
 * @param {string} props.country             - Country (always required, 2 character ISO code)
 * @param {string} props.administrative_area - State / Province / Region (ISO code when available)
 * @param {string} props.locality            - City / Town
 * @param {string} props.postal_code         - Postal code / ZIP Code
 * @param {string} props.thoroughfare        - Street address
 * @param {string} props.premise             - Apartment, Suite, Box number, etc.
 *
 * @throws {SyntaxError} if missing properties
 */
function validate(props) {
  let required = [
    'accountID',
    'country', 
    'administrative_area', 
    'locality', 
    'postal_code', 
    'thoroughfare',
    'premise',
  ]

  let errors = []
  for (let prop of required) 
    if (!props[prop]) 
      errors.push(prop)

  if (errors.length > 0) {
    let err = SyntaxError('missing required properties')
    err.notfound = errors
    throw err
  }
}


/**
 * adapted schema from the battle hardened https://www.drupal.org/project/addressfield
 *
 * @param {object} props
 * @param {string} props.accountID           - owner
 * @param {string} props.country             - Country (always required, 2 character ISO code)
 * @param {string} props.administrative_area - State / Province / Region (ISO code when available)
 * @param {string} props.locality            - City / Town
 * @param {string} props.postal_code         - Postal code / ZIP Code
 * @param {string} props.thoroughfare        - Street address
 * @param {string} props.premise             - Apartment, Suite, Box number, etc.
 */
async function save(props) {

  // ensure it is a valid house
  validate(props)

  // create the houseID
  let b64 = str=> Buffer.from(str).toString('base64') 
  let {country, administrative_area, locality, postal_code, thoroughfare, premise} = props
  props.houseID = `${country}-${administrative_area}-${locality}-${postal_code}-${b64(thoroughfare)}-${b64(premise)}`

  // write the data
  let data = await arc.tables()
  return data.houses.put(props)
}


/**
 * find a house
 *
 * @param {object} params
 * @param {string} params.accountID
 * @param {string} params.houseID 
 * @param {string} params.beginsWith
 */
async function find(params) {

  let data = await arc.tables()

  if (params.accountID) {
    let result = await data.houses.query({ 
      IndexName: 'accountID-index',
      KeyConditionExpression: `#accountID = :accountID`,
      ExpressionAttributeNames: {
        '#accountID': 'accountID'
      },
      ExpressionAttributeValues: {
        ':accountID': params.accountID
      }
    })
    return result.Items
  }

  if (params.houseID) {
    let result = await data.houses.query({ 
      IndexName: 'country-houseID-index',
      KeyConditionExpression: `#country = :country and #houseID = :houseID`,
      ExpressionAttributeNames: {
        '#country': 'country',
        '#houseID': 'houseID'
      },
      ExpressionAttributeValues: {
        ':country': params.houseID.substr(0, 2),
        ':houseID': params.houseID
      }
    })
    return result.Items[0]
  }

  if (params.beginsWith) {
    let result = await data.houses.query({ 
      IndexName: 'country-houseID-index',
      KeyConditionExpression: '#country = :country and begins_with(#houseID, :beginsWith)',
      ExpressionAttributeNames: {
        '#country': 'country',
        '#houseID': 'houseID'
      },
      ExpressionAttributeValues: {
        ':country': params.beginsWith.substr(0, 2),
        ':beginsWith': params.beginsWith
      }
    })
    return result.Items
  }

  throw SyntaxError('invalid params; expected one of houseID, accountID or beginsWith')
}
