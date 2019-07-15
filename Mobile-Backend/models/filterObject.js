/*
EXAMPLE FILTER JSON OBJECT
{
    "priceMin": 120000,
    "priceMax": 200000,
    "bedMin": 2,
    "bedMax": 4,
    "bathMin": 2,
    "bathMax": 3,
    "roomMin": 4,
    "roomMax": 5,
    "tags": ["detached", "maisonette", "garden"]
}
*/
function Filters(priceMin, priceMax, bedMin, bedMax, bathMin, bathMax, roomMin, roomMax, tags){
    this.priceMin = priceMin;                  // float
    this.priceMax = priceMax;                  // float
    this.bedMin = bedMin;                      // int
    this.bedMax = bedMax;                      // int
    this.bathMin = bathMin;                    // int
    this.bathMax = bathMax;                    // int
    this.roomMin = roomMin;                    // int
    this.roomMax = roomMax;                    // int
    this.tags = tags;                          // string[]
}

module.exports = {
    Filters: Filters
};