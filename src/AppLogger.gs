const spreadsheetId = '';
const logSheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

function log(text){
  logSheet.appendRow(
    [new Date(), text]
  );
}