var xl = require('excel4node');
const Convert = require('./snake_and_camel');


async function CreateSpreadsheet(title, headerRow, data) {
    // Create a new instance of a Workbook class
    let wb = new xl.Workbook();
    // Add Worksheets to the workbook
    let ws = wb.addWorksheet(title);

    var sharedStyle = wb.createStyle({
        alignment: {
          wrapText: true,
          horizontal: 'left',
        },
    });

    let row = 1;
    for(let i = 0; i < headerRow.length; i++) {
        ws.column(i+1).setWidth(18);
        ws.cell(row, i+1).string(Convert.snakeToTitle(headerRow[i])).style(sharedStyle);
    }

    row = 2;
    for(let i = 0; i < data.length; i++) {
        let record = data[i];
        for(let col = 0; col < record.length; col++) {
            if(record[col].type === 'String') {
                ws.cell(row, col+1).string(record[col].value).style(sharedStyle);
            } else if(record[col].type === 'Number') {
                ws.cell(row, col+1).number(record[col].value).style(sharedStyle);
            }
        }
        row++;
    }

    return wb;

}


module.exports = { CreateSpreadsheet }