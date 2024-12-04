function myFunction() {
  // 
  const text = "安心してください！\n拾ってます！";
  const broadcast = false;
  const groupId = 'C9d63141d128b0d7abf7e33f08b1521d1'; // テスト
  // const groupId = 'C58cfbf0ade6a012495508e0aa79213eb'; // 朝活で生産性上げ隊

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
