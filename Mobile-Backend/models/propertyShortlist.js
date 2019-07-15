const propertyModel = require("../mongodb/models/PropertyShortlist");

class propertyShortlist {
constructor(propertyName, fullAddress, propertyType, bedroomNumber, bathroomNumber, parkingSpaces, tags, propertyImageUrl, propertyThumbUrl, isForSale, isForRent, price, lat, long, notes, lister_url, lister_name)
{
    this.propertyName = propertyName;           // string
    this.fullAddress = fullAddress;             // string
    this.propertyType = propertyType;           // string
    this.bedroomNumber = bedroomNumber;         // number
    this.bathroomNumber = bathroomNumber;       // number
    this.parkingSpaces = parkingSpaces;         // number
    this.tags = tags;                           // string[]
    this.propertyImageUrl = propertyImageUrl;   // string
    this.propertyThumbUrl = propertyThumbUrl;   // string
    this.isForSale = isForSale;                 // boolean
    this.isForRent = isForRent;                 // boolean
    this.price = price;                         // number
    this.lat = lat;                             // float
    this.long = long;                           // float
    this.notes = notes;                         // Object
    this.lister_url = lister_url;
    this.lister_name = lister_name;
}

    toDbModel() {
        return new propertyModel({
            propertyName: this.propertyName,
            fullAddress: this.fullAddress,
            propertyType: this.propertyType,
            bedroomNumber: this.bedroomNumber,
            bathroomNumber: this.bathroomNumber,
            parkingSpaces: this.parkingSpaces,
            tags: this.tags,
            propertyImageUrl: this.propertyImageUrl,
            propertyThumbUrl: this.propertyThumbUrl,
            isForSale: this.isForSale,
            isForRent: this.isForRent,
            price: this.price,
            lat: this.lat,
            long: this.long,
            notes: this.notes,
            lister_url: this.lister_url,
            lister_name: this.lister_name
        });
    };
}

module.exports = propertyShortlist;