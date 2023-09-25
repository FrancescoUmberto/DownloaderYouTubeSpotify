import fs from 'fs'
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import searchSong from './youtubeScripts.js';

function ytDownload() {
  fs.writeFile('link.json', JSON.stringify(document.getElementById('linkYoutube')), err => {
    if (err) {
      console.log(err);
    }
  });
}
//Funzione per eliminare il file una volta scaricato
export function deleteFile(outputFilePathDown) {
  fs.unlink(outputFilePathDown, err => {
      if (err) {
          console.log(err);
      }
  });
}

//function ytDownload() {
//if (formatValue == '') {
//alert('Scegliere formato');
//return;
//}
//const linkDown = document.getElementById("linkYoutube").value;
//console.log(linkDown);
//document.download(ytdl(linkDown).pipe(fs.createWriteStream('video.mp4')));
//const download = ytdl(linkDown, {quality: 'highest'});
//download.pipe(fs.createWriteStream('video.flv'));
//return;
//}
function setValue(clicked_id) {
  let formatValue = '';
  formatValue = clicked_id;
  console.log(formatValue);
  return;
};
