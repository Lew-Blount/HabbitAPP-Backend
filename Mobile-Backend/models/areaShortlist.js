const areaModel = require("../mongodb/models/AreaShortlist");

class areaShortlist {
    constructor(lat, long, postcode,broadband, gas, electricity, crime, avgPrice, notes)
    {
        this.lat = lat;                                 // Number
        this.long = long;                               // Number
        this.postcode = postcode;                       //Object
        this.broadband = broadband;                     //Object
        this.gas = gas;                                 //Object
        this.electricity = electricity;                 //Object
        this.crime = crime;                             //Object[]
        this.avgPrice = avgPrice;                       //number
        this.notes = notes;                             // Object
    }

    toDbModel() {
        return new areaModel({
            lat: this.lat,
            long: this.long,
            postcode: this.postcode,
            broadband: this.broadband,
            gas: this.gas,
            electricity: this.electricity,
            crime: this.crime,
            avgPrice: this.avgPrice,
            notes: this.notes
        });
    };
}

module.exports = areaShortlist;
