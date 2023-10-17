const http = require("http");

const url =
  "http://api.weatherstack.com/current?access_key=f550509930589879c48638c62c45580d&query=New York";

http.get(url, (res) => {
  const statusCode = res.statusCode;
  if (statusCode !== 200) {
    console.log(`Status code: ${statusCode}`);
    return;
  }
  let rawData = "";
  res.setEncoding("utf8");
  res.on("data", (chunk) => (rawData += chunk));
  res.on("end", () => {
    const parsedData = JSON.parse(rawData);
    console.log(parsedData);
  });
});
