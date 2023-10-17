const http = require("http");

const url = "http://aboba.com";

http
  .get(url, (res) => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
      console.log(`Status code: ${statusCode}`);
      return;
    }
    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => (rawData += chunk));
    res.on("end", () => {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    });
  })
  .on("error", (err) => {
    console.log(`Error: ${err.message}`);
  });
