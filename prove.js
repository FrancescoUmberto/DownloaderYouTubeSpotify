import { execSync } from 'child_process';
import ytdl from 'ytdl-core';
import fs from 'fs';

// const link='https://www.youtube.com/watch?v=7YuAzR2XVAM&pp=ygUUbG9zZSB5b3Vyc2VsZiBlbWluZW0%3D'
// ytdl(link).pipe(fs.createWriteStream('video.mp3'));
// const download = ytdl(link, {quality: 'highest'});
// download.pipe(fs.createWriteStream("video.mp3"));


//Replace inputFilePath and outputFilePath with the actual file paths
const inputFilePath = 'SITO_SERVER_YTSP_DOWN/video.mp3';
const outputFilePath = 'SITO_SERVER_YTSP_DOWN/output.mp3';



// Execute the ffmpeg command to re-encode the MP3 file
const ffmpegCommand = `ffmpeg -i ${inputFilePath} -codec:a libmp3lame -qscale:a 2 ${outputFilePath}`;
try {
  execSync(ffmpegCommand);
  console.log('Audio re-encoded successfully.');
} catch (error) {
  console.error('Error re-encoding audio:', error);
}

