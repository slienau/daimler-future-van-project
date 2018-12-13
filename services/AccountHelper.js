const Account = require('../models/Account.js')

class AccountHelper {
  // Check if any users are there and if not create two static users
  static async setUpAccounts () {
    let setupNeeded = false
    await Account.find({ 'username': 'admin' },
      function (error, items) {
        if (error || items === null || items.length === 0) {
          setupNeeded = true
        }
      })
    if (setupNeeded) {
      const admin = new Account({
        username: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        password: 'adminiscooler',
        address: {
          street: 'adminstreet 1',
          zipcode: 10000,
          city: 'Berlin'
        },
        email: 'ad@min.admin'
      })
      const maxUser = new Account({
        username: 'maexle',
        firstName: 'Max',
        lastName: 'Müller',
        password: 'maxiscool',
        email: 'max@max.max',
        address: {
          street: 'Salzufer 1',
          zipcode: 10587,
          city: 'Berlin'
        }
      })

      await admin.save()
      await maxUser.save()
    }
  }
}

module.exports = AccountHelper
