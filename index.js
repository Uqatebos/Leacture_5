import http from "http";
import { config } from "dotenv";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

config();

const access_key = process.env.access_key;

const getUrl = (key, city) =>
  `http://api.weatherstack.com/current?access_key=${key}&query=${city}`;


const questionPromisify = () => {
  return new Promise((resolve, reject) => {
    try {
      rl.question(
        "This is a weather viewing application, \nif you want to see the weather in Moscow, write <yes>\n if you want to see the weather in another city, enter its name:\n",
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
          reject(new Error(`HTTP error, status code: ${statusCode}`));
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
          } catch (err) {
            reject(new Error(err.message));
          }
        });
      })
      .on("error", (err) => {
        reject(new Error(err.message));
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

const createWetherObject = (data) => {
  return new Promise((resolve, reject) => {
    try {
      if (data?.success === false) {
        reject(new Error(data?.error?.info));
      }
      const location = data.location;
      const current = data.current;

      const wetherObject = {
        country: location.country,
        city: location.name,
        localtime: location.localtime.slice(11, 16),
        temperature: current.temperature,
        wind_speed: current.wind_speed,
        humidity: current.humidity,
        visibility: current.visibility,
        is_day: current.is_day,
        weather_descriptions: current.weather_descriptions[0].toLowerCase(),
      };
      resolve(wetherObject);
    } catch (err) {
      reject(err);
    }
  });
};

const responseToUser = (obj) => {
  console.log(
    `In ${obj.country}, in ${obj.city}, it is now ${obj.localtime} local time. Temperature ${obj.temperature} degrees Celsius, humidity ${obj.humidity}%, wind speed ${obj.wind_speed} kilometers per hour, visibility ${obj.visibility} kilometers, ${obj.weather_descriptions}.`
  );
  return;
};

const main = async () => {
  try {
    const data = await getData();
    const object = await createWetherObject(data);
    responseToUser(object);
  } catch (err) {
    console.log(err.message);
  }
};

main();
