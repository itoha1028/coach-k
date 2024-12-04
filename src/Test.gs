function myFunction() {
  // 
  const text = "安心してください！\n拾ってます！";
  const broadcast = false;
  const groupId = 'XXX'; // テスト
  // const groupId = 'XXX'; // 朝活で生産性上げ隊

  // メイン処理
  if(broadcast){
    const folder = DriveApp.getFolderById(REC_DIR_ID);
    const files = folder.getFiles();

    while(files.hasNext()) {
      const groupId = files.next();
      //push(groupId, text);
      log(text);
      Logger.log(text);
    }
  }else{
    push(groupId, text);
    Logger.log(text);
  }
}
