import http from "http";
import { config } from "dotenv";
import * as readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

config();

const access_key = process.env.access_key;

const getUrl = (key, city) =>
  `http://api.weatherstack.com/current?access_key=${key}&query=${city}`;

// const url =
//   "http://api.weatherstack.com/current?access_key=f550509930589879c48638c62c45580d&query=New York";

const questionPromisify = () => {
  return new Promise((resolve, reject) => {
    try {
      rl.question(
        "This is a weather viewing application, \nif you want to see the weather in Moscow, write <yes>\n if you want to see the weather in another city, enter its name",
        (answer) => {
          rl.close();
          resolve(answer);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

// questionPromisify()

const getAnswer = async () => {
  try {
    const answer = await questionPromisify();
    if (answer === "yes") {
      return "Moscow";
    } else {
      return answer;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const requestToServer = (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        const statusCode = res.statusCode;
        if (statusCode !== 200) {
          console.log(`Status code: ${statusCode}`);
          rejects(new Error(`HTTP error, status code: ${statusCode}`));
        }
        let rawData = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", async () => {
          try {
            const parsedData = await JSON.parse(rawData);
            resolve(parsedData);
            console.log(parsedData);
          } catch (err) {
            reject(err);
            console.log(`Data parse error: ${err}`);
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const getData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await getAnswer();
      const url = getUrl(access_key, city);
      const parsedData = await requestToServer(url);
      resolve(parsedData);
    } catch (err) {
      reject(err);
    }
  });
};

const main = async () => {
  try {
    const data = await getData();
    console.log(data);
  } catch (err) {
    console.log(err.message);
  }
};

main();
