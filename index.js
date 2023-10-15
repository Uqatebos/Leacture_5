const http = require('http');
const url = "http://api.weatherstack.com/current?access_key=f550509930589879c48638c62c45580d&query=New York";
http.get(url, (res) => {
 const statusCode = res.statusCode;
 if (statusCode !== 200) {
     console.error(`Status Code: ${statusCode}`);
     return;
 }
 res.setEncoding('utf8');
 let rawData = '';
 res.on('data', (chunk) => rawData += chunk);
 res.on('end', () => {
     let parsedData = JSON.parse(rawData);
     console.log(parsedData);
 });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
