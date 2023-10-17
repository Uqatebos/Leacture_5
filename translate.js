import http from "http";
import { config } from "dotenv";
import rl from "node:readline";
config();

const access_key = process.env.access_key;

const getUrl = (key, city) =>
  `http://api.weatherstack.com/current?access_key=${key}&query=${city}`;

// const url =
//   "http://api.weatherstack.com/current?access_key=f550509930589879c48638c62c45580d&query=New York";

const askAQuestion = async () => {
  const answer = await rl.question(
    "This is a weather viewing application, \nif you want to see the weather in Moscow, write <yes>\n if you want to see the weather in another city, enter its name"
  );
  if(answer === 'yes') {

  }
};


const requestToServer = (url) => {
    http
  .get(url, (res) => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
      console.log(`Status code: ${statusCode}`);
      return;
    }
    let rawData = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      rawData += chunk;
    });
    res.on("end", () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (err) {
        console.log(`Data parse error: ${err}`);
      }
    });
  })
  .on("error", (err) => {
    console.log("Got error: ", err.message);
  });
}
