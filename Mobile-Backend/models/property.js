function Property(fullAddress, propertyType, bedroomNumber, bathroomNumber, parkingSpaces, tags, propertyImageUrl, propertyThumbUrl, isForSale, isForRent, price, lat, long, lister_url, lister_name){
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
    this.lat = lat;                              // float
    this.long = long                            // float
    this.lister_url = lister_url;
    this.lister_name = lister_name;
}

module.exports = {
    Property: Property
};