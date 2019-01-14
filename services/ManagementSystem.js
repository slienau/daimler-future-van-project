class ManagementSystem {
  //= {1:new Date(),2:new Date(),3:new Date(),4:new Date(),5:new Date(),6:new Date(),7:new Date(),8:new Date(),9:new Date(),10:new Date()}
  // Returns the van ID and its time to arrival in seconds
  static requestVan (fromVB, toVB, time = new Date(), passengerCount = 1) {
    const vanID = Math.floor(Math.random() * 10) + 1
    const timeToVB = Math.floor(Math.random() * 15) * 60

    this.vanTimes[vanID] = new Date(Date.now() + (timeToVB * 1000))

    return { status: 'success', vanID: vanID, timeToVB: timeToVB }
  }
}
ManagementSystem.vanTimes = {}
module.exports = ManagementSystem
