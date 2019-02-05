const Account = require('../models/Account.js')

class AccountHelper {
  // Calculate the status of an account based on the loyalty points
  static status (loyaltyPoints) {
    if (!loyaltyPoints && typeof i !== 'number') {
      return null
    }
    let status
    if (loyaltyPoints > 200) {
      status = 'gold'
    } else if (loyaltyPoints > 100) {
      status = 'silver'
    } else {
      status = 'bronze'
    }
    return status
  }
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

    const christoph = new Account({
      username: 'christoph',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'christophiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const alex = new Account({
      username: 'alex',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'alexiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const sebastian = new Account({
      username: 'sebastian',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'sebastianiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const domenic = new Account({
      username: 'domenic',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'domeniciscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const marius = new Account({
      username: 'marius',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'mariusiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const philipp = new Account({
      username: 'philipp',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'philippiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const antonio = new Account({
      username: 'antonio',
      firstName: 'Max',
      lastName: 'Müller',
      password: 'antonioiscooler',
      email: 'max@max.max',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    await admin.save()
    await maxUser.save()
    await christoph.save()
    await sebastian.save()
    await alex.save()
    await domenic.save()
    await marius.save()
    await philipp.save()
    await antonio.save()
  }
}

module.exports = AccountHelper
