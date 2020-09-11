const waterMarksList = [
  {
    text: "طوطی 🦜",
    address: "template/parrot.png",
  },
  {
    text: "ربات 🤖",
    address: "template/robot.png",
  },
  {
    text: "خانه 🏠",
    address: "template/home.png",
  },
];
const imageFfmpeg = [
  `-i <FILE>`,
  `-i <WATERMARK>`,
  `-filter_complex overlay=W-w-10:H-h-10`,
  `<OUTPUT>`,
];
const videoFfmpeg = [
  `-i <FILE>`,
  `-i <WATERMARK>`,
  `-filter_complex overlay=W-w-10:H-h-10 -movflags frag_keyframe+empty_moov`,
  `-f mp4 <OUTPUT>`,
];
const textMarkUp = "🦒 @mamad"
module.exports.getTextMarkUp  = ()=>{return textMarkUp}
module.exports.getVideoFfmpegConfig = ()=>{return videoFfmpeg}
module.exports.getImageFfmpegConfig = () => {
  return imageFfmpeg;
};
module.exports.getWaterMarksList = () => {
  return waterMarksList;
};
