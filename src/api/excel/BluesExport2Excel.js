//这是从网上的，改了一点点 BluesExport2Excel.js
/* eslint-disable */
/* eslint-disable */
require("script-loader!file-saver");
import XLSX from "xlsx-style";

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === "number") cell.t = "n";
      else if (typeof cell.v === "boolean") cell.t = "b";
      else if (cell.v instanceof Date) {
        cell.t = "n";
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = "s";

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

function export_json_to_excel({
  title,
  multiHeader = [],
  header,
  data2,
  wscols,
  titleInfo,
  titleStyle,
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx",
  footTable=[],

} = {}) {
  // const merges = [`A1:${getCharCol(list.length - 2)}1`]; //合并单元格
  /* original data */
  var data = []

  filename = filename || "excel-list";
  //data.push([...data2]);

  // for (let i = tail.length - 1; i > -1; i--) {
  //   // data.unshift(tail[i]);
  //   data.unshift([tail[i], '', '', '', '', '', '']);
  // }
  //data.unshift(['备注：', description, '', '', '', '', '']);
  for (let i = data2.length - 1; i > -1; i--) {
    data.unshift(data2[i]);
  }

  if (title) {
    //data.unshift(title);
    // title.forEach(res=>{
    //   data.unshift(res);
    // })

  }
  if (header.length > 0) {
    data.unshift(header);
  }

  // data.unshift([multiHeader[0][0], '', multiHeader[0][1], multiHeader[0][2]]);
  // console.log(multiHeader)
  data.unshift(multiHeader);
  if (footTable.length > 0) {
    data.push(footTable);
  }
  var ws_name = "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  if (merges.length > 0) {
    if (!ws["!merges"]) ws["!merges"] = [];
    merges.forEach(item => {
      //console.log(item)
      ws["!merges"].push(XLSX.utils.decode_range(item));
    });
  }
  //console.log(ws["!merges"])

  if (autoWidth) {
    console.log(data)
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row =>
      row.map(val => {
        /*先判断是否为null/undefined*/
        if (val == null) {
          return {
            wch: 13
          };
        } else if (val.toString().charCodeAt(0) > 255) {
          /*再判断是否为中文*/
          return {
            wch: val.toString().length * 2
          };
        } else {
          return {
            wch: val.toString().length
          };
        }
      })
    );
    //console.log(colWidth);
    /*以第一行为初始值*/
    let result = colWidth[0];
    colWidth[0][0]["wch"] = 100;
    result = [colWidth[0][0]["wch"]]
    // console.log(colWidth[0][0]["wch"]);
    // for (let i = 1; i < colWidth.length; i++) {
    //   for (let j = 0; j < colWidth[i].length; j++) {
    //     // if (result[j]["wch"] < colWidth[i][j]["wch"]) {
    //     //   result[j]["wch"] = colWidth[i][j]["wch"];
    //     // }
    //     result.push(colWidth[i][j]["wch"])
    //   }
    // }
    //ws["!cols"] = [];
    // let wscols = [    // 每列不同宽度px
    //   { wch: 30 },
    //   { wch: 30 },
    //   { wch: 50 },
    //   { wch: 90 },
    // ];
    // workbook.SheetNames[0]获取到到是文件里的到第一个表格
    if(wscols.length>0){
      ws["!cols"] = wscols;
    }
    let wsrows = [{ hpx: 40 }];  // 每行固定高度px
    for (let i = 0; i < 24; i++) {   // total  列表条数
      wsrows.push({ hpx: 40 });
    }
    ws["!rows"] = wsrows;
    //console.log(result)
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  //console.log(ws)
  var dataInfo = wb.Sheets[wb.SheetNames[0]];
  console.log(dataInfo)
  const borderAll = {
    //单元格外侧框线
    top: {
      style: "thin"
    },
    bottom: {
      style: "thin"
    },
    left: {
      style: "thin"
    },
    right: {
      style: "thin"
    }
  };

  // //给所以单元格加上边框
  // for (var i in dataInfo) {
  //   //console.log(i)
  //   if (i == '!ref' || i == '!merges' || i == '!cols') {

  //   } else {
  //     dataInfo[i + ''].s = {
  //       border: borderAll
  //     }
  //   }
  // }

  // 标题行
  let arr = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
  ];
  // arr.some(function(v) {
  //   let a = merges[0].split(":");
  //   if (v == a[1]) {
  //     dataInfo[v].s = {};
  //     return true;
  //   } else {
  //     dataInfo[v].s = {};
  //   }
  // });
  //设置主标题样式

  let style = {
    font: {
      name: "等线",
      sz: 16,
      color: { rgb: "000000" },
      //bold: true
      // italic: false,
      // underline: false
    },
    border: borderAll,
    alignment: {
      horizontal: "center",
      vertical: "center"
    },


  };
  //console.log(data)
  for (let i = 0; i < arr.length; i++) {
    for (let x = 0; x < data.length; x++) {
      
      var arrName=''+arr[i]+(x+1)
      if(dataInfo[arrName]!=null){
        dataInfo[arrName].s = style;
      }
      //console.log(arrName)
    }
    
  }
if(titleInfo.length>0){
  titleInfo.forEach(element => {
    //console.log(element)
    dataInfo[element].s = titleStyle;

  });
}
console.log(dataInfo,titleInfo,'titleInfo')

  //excel标题样式
  // for (var i = 0; i < header.length; i++) {
  //   // dataInfo[arr[i]].s = style;
  // }
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: "binary"
  });
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    `${filename}.${bookType}`
  );
}
function toExportExcel(tHeader, data, filename, merges) {
  import("@/api/excel/BluesExport2Excel").then(excel => {
    //表头对应字段

    excel.export_json_to_excel({
      header: tHeader,
      data: data,
      filename: filename,
      merges: merges,
      autoWidth: true,
      bookType: "xlsx"
    });
  });
}
export { toExportExcel, export_json_to_excel };



