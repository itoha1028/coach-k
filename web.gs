/** postのエントリーポイント
 * @param event:Object
 */
function doPost(e) {
  try{
    let content = JSON.parse(e.postData.contents);
    log(JSON.stringify(content));
    dispach(content);
  }catch(e){
    log(e.stack);
  }
}

/** リクエストを解析して後続処理に連携する
 * @param content:JsonObject
 */
function dispach(content){
  //let event = content.events[0];
  for(event of content.events){
    if(!event){
      continue;
    }    

    let type = event.type;
    switch(type){
      case "join":    
        join(event.replyToken, event.source.groupId);
        break;
      case "memberJoined":
        send(event.replyToken, JOIN_MESSAGE);
        break;
      case "message":
        if(event.source.type === 'user'){
          send(event.replyToken, MESSAGE_NOT_SUPPORTED)
          continue;
        }
        if(event.message.type === 'text'){
          record(event.replyToken, event.source.groupId, event.source.userId,event.message.text);
        }
        break;
      default:
        // "unsend" 送信取り消し
        // "follow"
        // "unfollow"
        // "leave" 自分が抜ける
        // "memberLeft" メンバーが抜ける
        // "postback" こちらのpush送信に対するボタン押下などのリアクション
        // "videoPlayComplete"/"beacon"/"accountLink"/"things"
        break;
    }
  }
  return;
}

/** 招待イベントの際に、新しいSpreadSheetを作成する
 * botが招待された場合に呼び出される
 */
function join(replyToken, groupId){
  // Spreadsheetを作成する
  let recordSheet = loadRecordSheet(groupId);
  if(!recordSheet){
    let recordBook = createSpreadsheetInfolder(groupId);
    let recordBookId = recordBook.getId();//
    PropertiesService.getScriptProperties().setProperty(groupId, recordBookId);
    log("New SpreadSheet are created. groupId=" + groupId + ", recordBookId=" + recordBookId);
  }  
  send(replyToken, JOIN_MESSAGE);
}

/** 実績記録用のSpreadSheetを作成する
 * rootフォルダに作成されるため、作成後適切なフォルダに移動する
 */
function createSpreadsheetInfolder(fileName) {
  var folder = DriveApp.getFolderById(REC_DIR_ID);
  var newSS=SpreadsheetApp.create(fileName);
  var originalFile=DriveApp.getFileById(newSS.getId());
  var copiedFile = originalFile.makeCopy(fileName, folder);
  DriveApp.getRootFolder().removeFile(originalFile);
  return copiedFile;
}

/** アクティビティをスプレッドシートに記録する
 * @param replyToken:String
 * @param groupId:String
 * @param userId:String
 * @param text:String
 */
function record(replyToken, groupId, userId, text){

  // SpreadSheetに記録
  let today = new Date();
  if(isStarted(text)){
    let recordSheet = loadRecordSheet(groupId);
    if(!recordSheet){
      log("SpreadSheet is not created. groupId=" + groupId);
      send(replyToken, NOT_REGISTERED_MESSAGE);
    }
    recordSheet.appendRow(
      [toDateOfYear(today), 0, userId, text]
    );
    //send(replyToken, "[TEST] Activity Started.");
  }else if(isFinished(text)){
    let recordSheet = loadRecordSheet(groupId);
    if(!recordSheet){
      log("SpreadSheet is not created. groupId=" + groupId);
      send(replyToken, NOT_REGISTERED_MESSAGE);
    }
    recordSheet.appendRow(
      [toDateOfYear(today), 1, userId, text]
    );
    //send(replyToken, "[TEST] Activity Finished.");
  }else{
    //send(replyToken, "[TEST] No action proceeded.");
  }
}

function toDateOfYear(date){
  return (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
}

function isStarted(text){
  return (text.match(/開始/)
  || text.match(/かいし！/)
  || text.match(/スタート/)
  || text.match(/すたーと/)
  || text.match(/始めてま/)
  || text.match(/始めま/)
  || text.match(/はじめま/)
  || text.match(/はじめて/)
  || text.match(/始め！/)
  || text.match(/始まって/));
}

function isFinished(text){
  return (text.match(/終わり/)
  || text.match(/おわり/)
  || text.match(/終了/)
  || text.match(/おしまい/)
  || text.match(/終わってた/)
  || text.match(/おわってた/));
}

function loadRecordSheet(groupId){
  // SpreadSheetを起動
  let recordBookId = PropertiesService.getScriptProperties().getProperty(groupId);
  if(!recordBookId){
    return;
  }

  let recordBook = SpreadsheetApp.openById(recordBookId);
  // 月のシートを取得し、もしなければ作成する
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  let sheetOfThisMonth = recordBook.getSheetByName(thisYear + '-' + thisMonth);
  if(!sheetOfThisMonth){
    let newSheet = recordBook.insertSheet();
    newSheet.setName(thisYear + '-' + thisMonth);
    sheetOfThisMonth = newSheet;
    log('New sheet are created. groupId=' + groupId);
  }
  return sheetOfThisMonth;
}

