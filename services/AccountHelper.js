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
    const accs = await Account.find({ 'username': 'christoph' })
    if (accs !== null && accs.length !== 0) return (console.log(accs))

    const christoph = new Account({
      username: 'christoph',
      firstName: 'Christoph',
      lastName: 'Witzko',
      password: 'christophiscooler',
      email: 'christoph.witzko@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const alex = new Account({
      username: 'alex',
      firstName: 'Alex',
      lastName: 'Dittmann',
      password: 'alexiscooler',
      email: 'alex.dittmann@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const sebastian = new Account({
      username: 'sebastian',
      firstName: 'Sebastian',
      lastName: 'Lienau',
      password: 'sebastianiscooler',
      email: 'sebastian.lienau@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const domenic = new Account({
      username: 'domenic',
      firstName: 'Domenic',
      lastName: 'Bosin',
      password: 'domeniciscooler',
      email: 'domenic.bosin@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const marius = new Account({
      username: 'marius',
      firstName: 'Marius',
      lastName: 'Möck',
      password: 'mariusiscooler',
      email: 'marius.moeck@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const philipp = new Account({
      username: 'philipp',
      firstName: 'Philipp',
      lastName: 'Ratz',
      password: 'philippiscooler',
      email: 'philipp.ratz@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

    const antonio = new Account({
      username: 'antonio',
      firstName: 'Antonio',
      lastName: 'Schürer',
      password: 'antonioiscooler',
      email: 'antonio.schuerer@tu-berlin.de',
      address: {
        street: 'Salzufer 1',
        zipcode: 10587,
        city: 'Berlin'
      }
    })

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
