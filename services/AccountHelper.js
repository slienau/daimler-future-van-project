const Account = require('../models/Account.js')

class AccountHelper {
  // Check if any users are there and if not create two static users
  static async setUpAccounts () {
    const accs = await Account.find({ 'username': 'admin' })
    if (accs !== null && accs.length !== 0) return (console.log(accs))

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

module.exports = AccountHelper
