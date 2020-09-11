// require for node-telegram-bot-api promises
const dotenvConfigModule = require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const downloader = require("./util/downloader");
const keyboard = require("./model/keyboard");
const ffmpeg = require("./util/ffmpeg");
const fs = require("fs");

const cache ={}
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const addCaption = (path)=>{
  path = path.replace("output","")
  let tmp  = cache[path]
  delete cache[path];
  return tmp.replace(/\@(\w*|\_*)/gi,"")+require('./config').getTextMarkUp()
}
bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const raw_query = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "HTML",
  };
  let actions = raw_query.split("@@");
  switch (actions[0]) {
    case "vid":
      let videoWatermarkUrl = await keyboard.getWarteMark(actions[1]);
      let uri2 = await watermarker.watermark(actions[2], videoWatermarkUrl);
      const buffer2 = await fs.createReadStream(`${__dirname}/${uri2}`);
      buffer2.on("open", async (fd) => {
        bot
          .editMessageText("لطفا صبر کنید(ممکن است تا ۱ دقیقه طول بکشد)", opts)
          .then((dn) => {
            bot
              .sendVideo(opts.chat_id, buffer2, {caption : addCaption(uri)})
              .then((done) => {
                bot.deleteMessage(opts.chat_id, opts.message_id);
                fs.unlinkSync(`${__dirname}/${uri2}`);
                fs.unlinkSync(`${__dirname}/${uri2.split("output")[1]}`);
              })
              .catch((xx) => console.log(xx));
          });
      });
      break;
    case "img":
      let waterMarkAddress = await keyboard.getWarteMark(actions[1]);
      let uri = await ffmpeg.applyWaterMark(actions[2], waterMarkAddress, true);
      const buffer = await fs.createReadStream(`${__dirname}/${uri}`);
      console.log(actions);
      console.log(waterMarkAddress);

      buffer.on("open", async (fd) => {
        bot
          .editMessageText("لطفا صبر کنید(ممکن است تا ۱ دقیقه طول بکشد)", opts)
          .then((dn) => {
            bot
              .sendPhoto(opts.chat_id, buffer , {caption : addCaption(uri)})
              .then((done) => {
                bot.deleteMessage(opts.chat_id, opts.message_id);
                fs.unlinkSync(`${__dirname}/${uri}`);
                fs.unlinkSync(`${__dirname}/${uri.split("output")[1]}`);
              })
              .catch((xx) => console.log(xx));
          });
      });
      break;
  }
});
bot.on("message", async (msg) => {
  let chatId = msg.chat.id;
  if (msg.photo) {
    const imageUrl = await bot.getFileLink(
      msg.photo[Object.keys(msg.photo).length - 1].file_id
    );
    bot.sendMessage(chatId, "شروع بارگیری به سرور");
    downloader.download(imageUrl).then(async (fileUrl) => {
      cache[fileUrl] = msg.caption
      bot.sendMessage(
        chatId,
        "فایل ارسالی شما یک عکس میباشد.\nلطفا واترمارک مورد نظر خود را مشخص نمایید",
        {
          reply_markup: await keyboard.inline_keyBoard("img", fileUrl),
        }
      );
    });
  }
  if (msg.video) {
    const videoURL = await bot.getFileLink(msg.video.file_id);
    bot.sendMessage(chatId, "شروع بارگیری به سرور");
    downloader.download(videoURL).then(async (fileUrl) => {
      cache[fileUrl] = msg.caption
      bot.sendMessage(
        chatId,
        "فایل ارسالی شما یک فیلم میباشد.\nلطفا واترمارک مورد نظر خود را مشخص نمایید",
        {
          reply_markup: await keyboard.inline_keyBoard("img", fileUrl),
        }
      );
    });
  }
  if (!msg.video && !msg.photo) {
    bot.sendMessage(chatId, "پیام ارسالی الزاما باید شامل عکس و یا فیلم باشد");
  }
});
