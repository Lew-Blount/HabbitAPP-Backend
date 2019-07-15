function Marker(lat, long, hasMultiple){
    this.lat = lat;                          // float
    this.long = long;                        // float
    this.hasMultiple = hasMultiple;          // boolean
}

module.exports = {
    Marker: Marker
};
