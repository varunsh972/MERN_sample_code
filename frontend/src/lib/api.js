/*
common logics for call api
*/

const api = {};
module.exports = api;


api.fetch = (method, url, params) => {

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  
  };
  const token = localStorage.getItem('token');
  headers['x-access-token'] = token;
  const options = {
    method
  }; 
  if (url.match(/.*geocode.*/) && method === 'GET');
  else if(url.match(/.*sandbox.api.*/)) {
    delete  headers['x-access-token']
    options.headers = headers
    options.body =  JSON.stringify(params)
  }
  else { 
    options.headers = headers
    options.body =  JSON.stringify(params)
  }
  return fetch(url, options).then(response => (
    response.json()
  ))
    .catch(() => {
      const erresponse = { error: 501, description: "System Busy" };
      throw (erresponse);
    }).then((responseJson) => {
      if (!responseJson.error) {
        return responseJson;
      }
      throw (responseJson);
    });
};


api.post = (url, params) => (
  api.fetch('POST', url, params)
)
api.get = (url, params) => (
  api.fetch('GET', url, params)
)
api.remove = (url) => (
  api.fetch('DELETE',url)
)
api.put = (url,params) => (
  api.fetch('PUT',url,params)
)
