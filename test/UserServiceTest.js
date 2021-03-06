const assert = require("chai").assert;
const mocha = require("mocha");
const sinon = require("sinon");

const axios = require('axios');

const UserService = require('../services/UserService');

const upstreamUrl = "http://bpdts-test-app-v4.herokuapp.com"
const londonUrl = `${upstreamUrl}/city/London/users`;
const usersUrl = `${upstreamUrl}/users`;

const londonersData = [{ "id": 135, "first_name": "Mechelle", "last_name": "Boam", "email": "mboam3q@thetimes.co.uk", "ip_address": "113.71.242.187", "latitude": -6.5115909, "longitude": 105.652983 },
{ "id": 396, "first_name": "Terry", "last_name": "Stowgill", "email": "tstowgillaz@webeden.co.uk", "ip_address": "143.190.50.240", "latitude": -6.7098551, "longitude": 111.3479498 },
{ "id": 520, "first_name": "Andrew", "last_name": "Seabrocke", "email": "aseabrockeef@indiegogo.com", "ip_address": "28.146.197.176", "latitude": "27.69417", "longitude": "109.73583" },
{ "id": 658, "first_name": "Stephen", "last_name": "Mapstone", "email": "smapstonei9@bandcamp.com", "ip_address": "187.79.141.124", "latitude": -8.1844859, "longitude": 113.6680747 },
{ "id": 688, "first_name": "Tiffi", "last_name": "Colbertson", "email": "tcolbertsonj3@vimeo.com", "ip_address": "141.49.93.0", "latitude": 37.13, "longitude": -84.08 },
{ "id": 794, "first_name": "Katee", "last_name": "Gopsall", "email": "kgopsallm1@cam.ac.uk", "ip_address": "203.138.133.164", "latitude": 5.7204203, "longitude": 10.901604 }];

const usersData = [{"id":1,"first_name":"Maurise","last_name":"Shieldon","email":"mshieldon0@squidoo.com","ip_address":"192.57.232.111","latitude":34.003135,"longitude":-117.7228641},
{"id":2,"first_name":"Bendix","last_name":"Halgarth","email":"bhalgarth1@timesonline.co.uk","ip_address":"4.185.73.82","latitude":-2.9623869,"longitude":104.7399789},
{"id":3,"first_name":"Meghan","last_name":"Southall","email":"msouthall2@ihg.com","ip_address":"21.243.184.215","latitude":"15.45033","longitude":"44.12768"},
{"id":4,"first_name":"Sidnee","last_name":"Silwood","email":"ssilwood3@gizmodo.com","ip_address":"77.55.231.220","latitude":-26.94087,"longitude":29.24905},
{"id":5,"first_name":"Rosita","last_name":"Ferrulli","email":"rferrulli4@unesco.org","ip_address":"182.189.27.66","latitude":33.5719791,"longitude":-84.3396421},
{"id":135,"first_name":"Mechelle","last_name":"Boam","email":"mboam3q@thetimes.co.uk","ip_address":"113.71.242.187","latitude":-6.5115909,"longitude":105.652983},
{"id":396,"first_name":"Terry","last_name":"Stowgill","email":"tstowgillaz@webeden.co.uk","ip_address":"143.190.50.240","latitude":-6.7098551,"longitude":111.3479498},
{"id":520,"first_name":"Andrew","last_name":"Seabrocke","email":"aseabrockeef@indiegogo.com","ip_address":"28.146.197.176","latitude":"27.69417","longitude":"109.73583"},
{"id":658,"first_name":"Stephen","last_name":"Mapstone","email":"smapstonei9@bandcamp.com","ip_address":"187.79.141.124","latitude":-8.1844859,"longitude":113.6680747},
{"id":688,"first_name":"Tiffi","last_name":"Colbertson","email":"tcolbertsonj3@vimeo.com","ip_address":"141.49.93.0","latitude":37.13,"longitude":-84.08},
{"id":794,"first_name":"Katee","last_name":"Gopsall","email":"kgopsallm1@cam.ac.uk","ip_address":"203.138.133.164","latitude":5.7204203,"longitude":10.901604},
{"id":266,"first_name":"Ancell","last_name":"Garnsworthy","email":"agarnsworthy7d@seattletimes.com","ip_address":"67.4.69.137","latitude":51.6553959,"longitude":0.0572553},
{"id":322,"first_name":"Hugo","last_name":"Lynd","email":"hlynd8x@merriam-webster.com","ip_address":"109.0.153.166","latitude":51.6710832,"longitude":0.8078532},
{"id":554,"first_name":"Phyllys","last_name":"Hebbs","email":"phebbsfd@umn.edu","ip_address":"100.89.186.13","latitude":51.5489435,"longitude":0.3860497}]

mocha.describe('User Service', () => {
    const UserServiceInstance = new UserService();

    before(() => {
        sinon.stub(axios, "get").withArgs(londonUrl).returns({ data: londonersData })
            .withArgs(usersUrl).returns({ data: usersData });
    })

    it('is not null', () => {
        assert.isNotNull(UserServiceInstance);
    })

    it('returns the expected number of users down as living in London', async () => {

        const expected = 6;
        const actual = await UserServiceInstance.getBySelectedLondon();
        assert.equal(actual.length, expected);
    })

    it('returns the expected number of users within 60 mile radius of London', async () => {
        const expected = 3;
        const actual = await UserServiceInstance.getByRadiusFromLondon(60);
        assert.equal(actual.length, expected);
    })

    it('returns the expected number of users down as living in London or within a 60 mile radius', async () => {
        const expected = 9;
        const actual = await UserServiceInstance.getBySelectedOrRadiusFromLondon(60);
        assert.equal(actual.length, expected);
    })
});