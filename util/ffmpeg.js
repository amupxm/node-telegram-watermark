const { spawn } = require("child_process");
const config = require("../config");

const getFfmpegConfig = (filePath, waterMarkPath, isImage, tmp = []) => {
  rawConfig = isImage
    ? config.getVideoFfmpegConfig()
    : config.getImageFfmpegConfig();
  rawConfig.forEach((line) => {
    tmp.push(
      line
        .replace("<OUTPUT>", `./output${filePath}`)
        .replace("<FILE>", `./${filePath}`)
        .replace("<WATERMARK>", `./${waterMarkPath}`)
    );
  });
  return tmp;
};

module.exports.applyWaterMark = async (filePath, waterMarkPath, isImage) => {
  try {
    return new Promise(async (resolve, reject) => {
      const child = await spawn(
        "ffmpeg ",
        getFfmpegConfig(filePath, waterMarkPath, isImage ? false : true),
        { shell: true }
      );
      child.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
      child.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        resolve("output" + filePath);
      });
    });
  } catch (err) {}
};
