//util.js
import "@/api/excel/Blob";

export { json2excel, getCharCol, formatJson };

// function parseTime(time, cFormat) {
//   if (arguments.length === 0) {
//     return null;
//   }
//   const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
//   let date;
//   if (typeof time === "object") {
//     date = time;
//   } else {
//     if (typeof time === "string" && /^[0-9]+$/.test(time)) {
//       time = parseInt(time);
//     }
//     if (typeof time === "number" && time.toString().length === 10) {
//       time = time * 1000;
//     }
//     date = new Date(time);
//   }
//   const formatObj = {
//     y: date.getFullYear(),
//     m: date.getMonth() + 1,
//     d: date.getDate(),
//     h: date.getHours(),
//     i: date.getMinutes(),
//     s: date.getSeconds(),
//     a: date.getDay()
//   };
//   // eslint-disable-next-line
//   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
//     let value = formatObj[key];
//     // Note: getDay() returns 0 on Sunday
//     if (key === "a") {
//       return ["日", "一", "二", "三", "四", "五", "六"][value];
//     }
//     if (result.length > 0 && value < 10) {
//       value = "0" + value;
//     }
//     return value || 0;
//   });
//   // eslint-disable-next-line
//   return time_str;
// }

function json2excel(tableJson, filenames, autowidth, bookTypes) {
  import("@/api/excel/Export2Excel").then(excel => {
    var tHeader = [];
    var dataArr = [];
    var sheetnames = [];
    for (var i in tableJson) {
      tHeader.push(tableJson[i].tHeader);
      dataArr.push(formatJson(tableJson[i].filterVal, tableJson[i].tableDatas));
      sheetnames.push(tableJson[i].sheetName);
    }
    excel.export_json_to_excel({
      header: tHeader,
      data: dataArr,
      sheetname: sheetnames,
      filename: filenames,
      autoWidth: autowidth,
      bookType: bookTypes
    });
  });
}
// 数据过滤，时间过滤
function formatJson(filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      if (j === "timestamp") {
        return parseTime(v[j]);
      } else {
        return v[j];
      }
    })
  );
}

// 获取26个英文字母用来表示excel的列
function getCharCol(n) {
  for (var i = 0; i < this.list.length; i++) {
    this.list[i].showActive = false;
    if (index == i) {
      this.list[index].showActive = true;
    }
  }

  let temCol = "",
    s = "",
    m = 0;
  while (n > 0) {
    m = (n % 26) + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26;
  }
  return s;
}
