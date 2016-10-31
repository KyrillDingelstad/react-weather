var rootUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
var apiKey = '&appid=8fc87986737bdc013e336a2bab817c10';

module.exports = {
    get: function(place) {
        
    return fetch(rootUrl + place + apiKey)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        return 'error';
      });
    }
};