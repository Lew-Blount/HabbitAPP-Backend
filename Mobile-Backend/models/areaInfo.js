function AreaInfo(lat, long, postcode,broadband, gas, electricity, crime, avgPrice) {
    this.lat = lat;                                 // Number
    this.long = long;                               // Number
    this.postcode = postcode;                       //string
    this.broadband = broadband;                      //string[]
    this.gas = gas;                                 //string[]
    this.electricity = electricity;                 //string[]
    this.crime = crime;                             //string[]
    this.avgPrice = avgPrice                        //num
}

module.exports = {
    AreaInfo: AreaInfo
};
