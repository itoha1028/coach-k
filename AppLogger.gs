const logSheet = SpreadsheetApp.openById('1Cceybe7rrUoeX5-5e56PPBwfRPAga0OzHNnsK7r5C7Q').getActiveSheet();

function log(text){
  logSheet.appendRow(
    [new Date(), text]
  );
}