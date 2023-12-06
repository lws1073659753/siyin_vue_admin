//这是从网上的，改了一点点 Export2Excel.js
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
  filename,
  merges = [],
  autoWidth = true,
  bookType = "xlsx",
  tail,
  description
} = {}) {
  // const merges = [`A1:${getCharCol(list.length - 2)}1`]; //合并单元格
  /* original data */
  var data = []

  filename = filename || "excel-list";
  //data.push([...data2]);

  for (let i = tail.length - 1; i > -1; i--) {
    // data.unshift(tail[i]);
    data.unshift([tail[i], '', '', '', '', '', '']);
  }
  data.unshift(['备注：', description, '', '', '', '', '']);
  for (let i = data2.length - 1; i > -1; i--) {
    data.unshift(data2[i]);
  }

  if (title) {
    //data.unshift(title);
    // title.forEach(res=>{
    //   data.unshift(res);
    // })

  }
  data.unshift(header);
  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift([multiHeader[i], '', '', '', '', '', '']);
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
    let wscols = [    // 每列不同宽度px
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 40 },
      { wch: 15 },

    ];
    // workbook.SheetNames[0]获取到到是文件里的到第一个表格
    ws["!cols"] = wscols;
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
  //console.log(dataInfo)
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
  const border = {
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
    "A1",
    "B1",
    "C1",
    "D1",
    "E1",
    "F1",
    "G1",

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
  let style0 = {
    font: {
      name: "等线",
      sz: 16,
      color: { rgb: "000000" },
      bold: true
      // italic: false,
      // underline: false
    },
    border: borderAll,
    alignment: {
      horizontal: "center",
      vertical: "center"
    },


  };
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
      horizontal: "left",
      vertical: "left"
    },


  };
  let style2 = {
    font: {
      name: "宋体",
      sz: 11,
      color: { rgb: "000000" },
      //bold: true
      // italic: false,
      // underline: false
    },
    alignment: {
      horizontal: "left",
      vertical: "left"
    },
    border: border,
    fill: {
      fgColor: { rgb: "fcfc04" },
    },

  };
  let style3 = {
    font: {
      name: "等线",
      sz: 9,
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
    fill: {
      fgColor: { rgb: "fcfc04" },
    },
  };
  let style4 = {
    font: {
      name: "宋体",
      sz: 9,
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
    fill: {
      fgColor: { rgb: "d9d9d9" },
    },
  };
  let style5 = {
    font: {
      name: "宋体",
      sz: 11,
      color: { rgb: "000000" },
      //bold: true
      // italic: false,
      // underline: false
    },
    alignment: {
      horizontal: "left",
      vertical: "left"
    },
    border: border,
   

  };
  dataInfo["A1"].s = style0;
  dataInfo["B1"].s = style0;
  dataInfo["C1"].s = style0;
  dataInfo["D1"].s = style0;
  dataInfo["E1"].s = style0;
  dataInfo["F1"].s = style0;
  dataInfo["G1"].s = style0;

  dataInfo["A2"].s = style2;
  dataInfo["B2"].s = style2;
  dataInfo["C2"].s = style2;
  dataInfo["D2"].s = style2;
  dataInfo["E2"].s = style2;
  dataInfo["F2"].s = style2;
  dataInfo["G2"].s = style2;

  dataInfo["A3"].s = style2;
  dataInfo["B3"].s = style2;
  dataInfo["C3"].s = style2;
  dataInfo["D3"].s = style2;
  dataInfo["E3"].s = style2;
  dataInfo["F3"].s = style2;
  dataInfo["G3"].s = style2;


  dataInfo["A4"].s = style2;
  dataInfo["B4"].s = style2;
  dataInfo["C4"].s = style2;
  dataInfo["D4"].s = style2;
  dataInfo["E4"].s = style2;
  dataInfo["F4"].s = style2;
  dataInfo["G4"].s = style2;


  dataInfo["A5"].s = style2;
  dataInfo["B5"].s = style2;
  dataInfo["C5"].s = style2;
  dataInfo["D5"].s = style2;
  dataInfo["E5"].s = style2;
  dataInfo["F5"].s = style2;
  dataInfo["G5"].s = style2;

  //dataInfo["A1"].s = style;
  dataInfo["A7"].s = style;
  dataInfo["A8"].s = style4;
  dataInfo["A9"].s = style3;
  dataInfo["A10"].s = style3;
  dataInfo["A11"].s = style3;
  dataInfo["A12"].s = style3;
  dataInfo["A13"].s = style3;
  dataInfo["A14"].s = style3;
  dataInfo["A15"].s = style3;
  dataInfo["A16"].s = style3;

  dataInfo["B8"].s = style4;
  dataInfo["B9"].s = style3;
  dataInfo["B10"].s = style3;
  dataInfo["B11"].s = style3;
  dataInfo["B12"].s = style3;
  dataInfo["B13"].s = style3;
  dataInfo["B14"].s = style3;
  dataInfo["B15"].s = style3;
  dataInfo["B16"].s = style3;

  dataInfo["C8"].s = style4;
  dataInfo["C9"].s = style3;
  dataInfo["C10"].s = style3;
  dataInfo["C11"].s = style3;
  dataInfo["C12"].s = style3;
  dataInfo["C13"].s = style3;
  dataInfo["C14"].s = style3;
  dataInfo["C15"].s = style3;
  dataInfo["C16"].s = style3;

  dataInfo["D8"].s = style4;
  dataInfo["D9"].s = style3;
  dataInfo["D10"].s = style3;
  dataInfo["D11"].s = style3;
  dataInfo["D12"].s = style3;
  dataInfo["D13"].s = style3;
  dataInfo["D14"].s = style3;
  dataInfo["D15"].s = style3;
  dataInfo["D16"].s = style3;

  dataInfo["E8"].s = style4;
  dataInfo["E9"].s = style3;
  dataInfo["E10"].s = style3;
  dataInfo["E11"].s = style3;
  dataInfo["E12"].s = style3;
  dataInfo["E13"].s = style3;
  dataInfo["E14"].s = style3;
  dataInfo["E15"].s = style3;
  dataInfo["E16"].s = style3;

  dataInfo["F8"].s = style4;
  dataInfo["F9"].s = style3;
  dataInfo["F10"].s = style3;
  dataInfo["F11"].s = style3;
  dataInfo["F12"].s = style3;
  dataInfo["F13"].s = style3;
  dataInfo["F14"].s = style3;
  dataInfo["F15"].s = style3;
  dataInfo["F16"].s = style3;

  dataInfo["G8"].s = style4;
  dataInfo["G9"].s = style3;
  dataInfo["G10"].s = style3;
  dataInfo["G11"].s = style3;
  dataInfo["G12"].s = style3;
  dataInfo["G13"].s = style3;
  dataInfo["G14"].s = style3;
  dataInfo["G15"].s = style3;
  dataInfo["G16"].s = style3;

  // dataInfo["A17"].s = style;
  dataInfo["A17"].s = style;
  dataInfo["B17"].s = style;
  dataInfo["C17"].s = style;
  dataInfo["D17"].s = style;
  dataInfo["E17"].s = style;
  dataInfo["F17"].s = style;
  dataInfo["G17"].s = style;
  // dataInfo["A18"].s = style2;
  // dataInfo["A19"].s = style2;
  // dataInfo["A20"].s = style2;
  // dataInfo["A21"].s = style2;
  // dataInfo["A22"].s = style2;
  // dataInfo["A23"].s = style2;
  // dataInfo["A24"].s = style2;

  dataInfo["A18"].s = style2;
  dataInfo["B18"].s = style2;
  dataInfo["C18"].s = style2;
  dataInfo["D18"].s = style2;
  dataInfo["E18"].s = style2;
  dataInfo["F18"].s = style2;
  dataInfo["G18"].s = style2;

  dataInfo["A19"].s = style2;
  dataInfo["B19"].s = style2;
  dataInfo["C19"].s = style2;
  dataInfo["D19"].s = style2;
  dataInfo["E19"].s = style2;
  dataInfo["F19"].s = style2;
  dataInfo["G19"].s = style2;

  dataInfo["A20"].s = style2;
  dataInfo["B20"].s = style2;
  dataInfo["C20"].s = style2;
  dataInfo["D20"].s = style2;
  dataInfo["E20"].s = style2;
  dataInfo["F20"].s = style2;
  dataInfo["G20"].s = style2;


  dataInfo["A21"].s = style5;
  dataInfo["B21"].s = style5;
  dataInfo["C21"].s = style5;
  dataInfo["D21"].s = style5;
  dataInfo["E21"].s = style5;
  dataInfo["F21"].s = style5;
  dataInfo["G21"].s = style5;


  dataInfo["A22"].s = style5;
  dataInfo["B22"].s = style5;
  dataInfo["C22"].s = style5;
  dataInfo["D22"].s = style5;
  dataInfo["E22"].s = style5;
  dataInfo["F22"].s = style5;
  dataInfo["G22"].s = style5;

  dataInfo["A23"].s = style5;
  dataInfo["B23"].s = style5;
  dataInfo["C23"].s = style5;
  dataInfo["D23"].s = style5;
  dataInfo["E23"].s = style5;
  dataInfo["F23"].s = style5;
  dataInfo["G23"].s = style5;


  dataInfo["A24"].s = style5;
  dataInfo["B24"].s = style5;
  dataInfo["C24"].s = style5;
  dataInfo["D24"].s = style5;
  dataInfo["E24"].s = style5;
  dataInfo["F24"].s = style5;
  dataInfo["G24"].s = style5;


  //excel标题样式
  for (var i = 0; i < header.length; i++) {
    // dataInfo[arr[i]].s = style;
  }
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
  import("@/api/excel/Export2Excel").then(excel => {
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



