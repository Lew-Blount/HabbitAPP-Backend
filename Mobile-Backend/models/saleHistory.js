function SaleHistory(fullAddress, propertyType, saleHistory){
    this.fullAddress = fullAddress;             // string
    this.propertyType = propertyType;           // string
    this.saleHistory = saleHistory;             // {date, price}[]
}

module.exports = {
    SaleHistory: SaleHistory
};