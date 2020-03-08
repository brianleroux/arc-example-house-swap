@app
house-swap

# @http
# reads
# get /login
# get /logout
# get /                     # display houses on map (or maybe a shitty craigslist list interface to start)
# get /houses/:houseID      # display a house
# get /account              # display your account (and its houses swaps.requested and swaps.initiated)

# writes
# post /houses              # create a house
# post /houses/:houseID     # update a house (state: hidden, onmarket, retired)
# post /swaps               # create a swap state:initiated
# post /swaps/:swapID       # update (state: initiated/accepted/denied/cancelled) swap

@tables
accounts
  accountID *String

houses
  accountID *String
  houseID **String

swaps
  initiated *String
  requested **String

@indexes
houses
  accountID *String

houses
  country *String
  houseID **String # country-state-city-zip-street-number-number eg. CA-BC-Vancouver-v6a0a5-eastcordovast-22-333

swaps
  requested *String
