class ManagementSystem {
  //= {1:new Date(),2:new Date(),3:new Date(),4:new Date(),5:new Date(),6:new Date(),7:new Date(),8:new Date(),9:new Date(),10:new Date()}
  // Returns the van ID and its time to arrival in seconds
  static requestVan (fromVB, toVB, time = new Date(), passengerCount = 1) {
    const vanId = Math.floor(Math.random() * 10) + 1
    const timeToVB = Math.floor(Math.random() * 15) * 60

    this.vanTimes[vanId] = new Date(Date.now() + (timeToVB * 1000))
    this.vanPositions[vanId] = { latitude: 52.5150 + Math.random() * 2 / 100, longitude: 13.3900 + Math.random() * 2 / 100 }

    return { status: 'success', vanID: vanId, timeToVB: timeToVB }
  }
}
ManagementSystem.vanTimes = {}
ManagementSystem.vanPositions = {}
module.exports = ManagementSystem
