const Downloader = require("node-url-downloader");
module.exports.download = (url) => {
  return new Promise((resolve, reject) => {
    const download = new Downloader();
    download.get(url);
    download.on("error", (dst) => {
      reject(true);
    });
    download.on("done", (dst) => {
        resolve(dst);
      });
  });
};
