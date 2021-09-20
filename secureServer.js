const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require('path');

const dev = true;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const port = 4002;

const httpsOptions = {
   key: fs.readFileSync("C:\\Users\\Mike W\\OneDrive - Fashion Craft\\My Projects\\SSL\\localhost\\localhost-key.pem"),
   cert: fs.readFileSync("C:\\Users\\Mike W\\OneDrive - Fashion Craft\\My Projects\\SSL\\localhost\\localhost.pem"),
};

app.prepare().then(() => {
   createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
   }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Server started on https://localhost:${port}`);
   });
});