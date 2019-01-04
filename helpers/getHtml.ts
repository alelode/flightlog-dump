import * as https from "https";
https.globalAgent.maxSockets = 10;

export function getHtml(url): Promise<string> {
  return new Promise(function (resolve, reject) {
    let request = https.get(url, function (res) {
      var data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });
      res.on("error", function (err) {
        console.log(err);
      });
      res.on("end", function () {
        request.end();
        resolve(data.toString());

      });
    });
    request.on("error", function (err) {
      console.log(err);
    });
  });
}