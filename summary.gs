function execReportSummarize() {
  // 毎月10日、20日、月末に実行
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;

  const endDayOfMonth = new Date(thisYear, thisMonth, 0);

  if(today.getDate() !== 10 && today.getDate() !== 20 && today.getDate() !== endDayOfMonth.getDate()){
    Logger.log('End script with no action.');
    return;
  }

  // メイン処理
  const folder = DriveApp.getFolderById(REC_DIR_ID);
  const files = folder.getFiles();

  while(files.hasNext()) {
    const groupId = files.next();
    const recordBookId = PropertiesService.getScriptProperties().getProperty(groupId);
    let recordBook = SpreadsheetApp.openById(recordBookId);
    let tmpSheet = recordBook.getSheetByName('tmp');
    if(!tmpSheet){
      let newSheet = recordBook.insertSheet();
      newSheet.setName('tmp');
      tmpSheet = newSheet;
    }
    
    const targetSheetName = thisYear + '-' + thisMonth;
    const sheetOfThisMonth = recordBook.getSheetByName(targetSheetName);
    
    // 今月のシートがなければ集計しない
    if(!sheetOfThisMonth){
      continue;
    }
    
    tmpSheet.getRange(1,1).setValue('=QUERY(\'' + targetSheetName + '\'!A:D; "SELECT C, COUNT(C) WHERE B=0 GROUP BY C"; -1)');

    const lastRaw = tmpSheet.getLastRow();
    const range = tmpSheet.getRange('A2:B' + lastRaw);
    const values = range.getValues();
    if(values.length == 0){
      // 実績がゼロの場合はグループが非活性なので配信しない
      continue;
    }

    const thisDay = today.getDate();

    let text = '今月の集計結果発表！\n\n'
    for(value of values){
      const user = value[0];
      const userName = resolveName(groupId, String(user));
      const count = value[1];
      if(userName === 'Unknown' && !count){
        continue;
      }

      const percentile = Math.floor(count/thisDay*100);

      text += userName + ': ' + count + '回(' + percentile + '%)\n';
      if(percentile < 10){
        text += 'こうしてる間に、君のライバルはどこまで進んでるんだろうな？\n';
      }else if(percentile < 20){
        text += 'ん？やっとアップが終わったんか？\n';
      }else if(percentile < 30){
        text += 'へいへいへい、満足すんの早くない？\n';
      }else if(percentile < 50){
        text += 'まだまだやれるやろ？\n';
      }else if(percentile <= 60){
        text += 'Good job\n';
      }else if(percentile <= 70){
        text += 'Keep working hard\n';
      }else if(percentile <= 80){
        text += 'ええやん、すごいやん！\n';
      }else if(percentile <= 100){
        text += 'よくやった、おじさんがご褒美をあげよう（意味深）\n';
      }else if(percentile > 100){
        text += 'どうやら君は触れてはいけない領域に足を踏み入れてしまったようだな...\n';
      }

      text += '\n';
    }
    
    if(values.length != countMembers(groupId)){
      const diff = countMembers(groupId) - values.length;
      text += 'あれ？まさかとは思うけど、一度も朝活していないやつが' + diff + '人いるんじゃないか？\nこうしてる間に、君のライバルはどこまで進んでるんだろうな？';
    }
    
    push(groupId, text);
    log(text);
    Logger.log(text);
    
    recordBook.deleteSheet(tmpSheet);
  };
}
