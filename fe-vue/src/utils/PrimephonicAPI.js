const api = process.env.REACT_APP_PRIMEPHONIC_API_URL || 'http://localhost:5001';

// Generate a random token to pass as header value during request
let token = localStorage.token;

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  'Accept': 'application/json',
  'Authorization': token
};

// export const getAll = () =>
//   fetch(`${api}/api/data`, { headers })
//     .then(res => res.json())
//     .then(data => {return data});

export const getProcessedData = (time) =>
  fetch(`${api}/api/usage?from=${time}`, { headers })
    .then(res => res.json())
    .then(data => {return data})
    .catch( (err) => {
    console.log("Error on getProcessedData, ", err)
  });