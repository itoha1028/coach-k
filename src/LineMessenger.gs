/** ユーザーのLINE DisplayNameを取得する
 * @param groupId:String
 * @param userId:String
 */
function resolveName(groupId, userId){
  const url = 'https://api.line.me/v2/bot/group/' + groupId + '/member/' + userId;
  const headers = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const options = {
        "method" : "get",
        "headers" : headers,
        "muteHttpExceptions" : true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const content = JSON.parse(response.getContentText());
  return (code == 200)? content.displayName: 'Unknown';
}

/** メッセージを返信する
 * @param replyToken:String
 * @param text:String
 */
function send(replyToken, text) {
  const url = "https://api.line.me/v2/bot/message/reply";
  const headers = {
      "Content-Type" : "application/json; charset=UTF-8",
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const postData = {
      "replyToken" : replyToken,
      "messages" : [
          {
              'type':'text',
              'text':text,
          }
      ]
  };
  const options = {
      "method" : "post",
      "headers" : headers,
      "payload" : JSON.stringify(postData),
  };
  return UrlFetchApp.fetch(url, options);
}

/** メッセージをpush送信する
 * @param groupId:String
 * @param text:String
 */
function push(groupId, text) {
  const url = "https://api.line.me/v2/bot/message/push";
  const headers = {
      "Content-Type" : "application/json; charset=UTF-8",
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const postData = {
      "to": String(groupId),
      "messages" : [
          {
              'type':'text',
              'text':text,
          }
      ]
  };
  const options = {
      "method" : "post",
      "headers" : headers,
      "payload" : JSON.stringify(postData),
  };
  return UrlFetchApp.fetch(url, options);
}

/** グループ内のbotを除いたメンバー数を取得する
 * @param groupId:String
 */
function countMembers(groupId){
  const url = 'https://api.line.me/v2/bot/group/' + groupId + '/members/count';
  const headers = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const options = {
        "method" : "get",
        "headers" : headers,
        "muteHttpExceptions" : true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const code = response.getResponseCode();
  const content = JSON.parse(response.getContentText());
  return (code == 200)? content.count: 0;
}