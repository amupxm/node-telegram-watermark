
const waterMarkList = require('../config').getWaterMarksList()
module.exports.inline_keyBoard = async (type, dst,tmp = []) => {
  waterMarkList.forEach((item, index) => {
    tmp.push([
      {
        text: item.text,
        callback_data: `${type}@@${index}@@${dst}`,
      },
    ]);
  });
  return {
    inline_keyboard: tmp,
  };
};

module.exports.getWarteMark = async (id)=>{
  return waterMarkList[id].address
}