const axios = require('axios');

const upstreamUrl = "http://bpdts-test-app-v4.herokuapp.com"
const londonUrl = `${upstreamUrl}/city/London/users`;
const usersUrl = `${upstreamUrl}/users`;

class UserService {
    constructor() {
        
    }

    async getBySelectedLondon() {
        return this.getBySelected('London')
    }

    async getBySelected(city) {
        try {
            const cityUrl = `${upstreamUrl}/city/${city}/users`
            const resp = await axios.get(cityUrl);
            return resp.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getByRadiusFromLondon(radiusInMiles) {
        try {
            const londonLocation = {lat: 51.509865, lon: -0.118092};
            return this.getByRadiusFrom(londonLocation, radiusInMiles);
        } catch (error) {
            console.log(error);
        }
    }

    async getByRadiusFrom(location, radiusInMiles) {
        try {
            const resp = await axios.get(usersUrl);
            return this.filterUsersByRadiusFrom(location, resp.data, 60);
        } catch (error) {
            console.log(error);
        }
    }

    async getBySelectedOrRadiusFromLondon(radiusInMiles) {
        try {
            const londonLocation = {lat: 51.509865, lon: -0.118092};
            const [respCity, respUsers] = await axios.all([
                axios.get(londonUrl),
                axios.get(usersUrl),
            ]);
    
            return respCity.data.concat(this.filterUsersByRadiusFrom(londonLocation, respUsers.data, radiusInMiles));
        } catch (error) {
            console.log(error);
        }
    }

    filterUsersByRadiusFrom(location, users, radiusInMiles) {
        return users.filter(user => this.withinRadius(user, radiusInMiles, location));
    }
    
    withinRadius(user, radiusMiles, placeLocation) {
        const userLocation = {lat: user.latitude, lon: user.longitude};
        const distanceMetres = this.getDistanceInMetres(placeLocation, userLocation);
        const radiusMetres = this.milesToMetres(radiusMiles);
        return radiusMetres >= distanceMetres;
    }
    
    // from https://www.movable-type.co.uk/scripts/latlong.html
    getDistanceInMetres(from, to) {
        const lat1 = from.lat;
        const lat2 = to.lat;
        const lon1 = from.lon;
        const lon2 = to.lon;
    
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;
    
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        const d = R * c; // in metres
        return d;
    }
    
    milesToMetres(miles) {
        return miles * 1609.34;
    }
}
module.exports = UserService;