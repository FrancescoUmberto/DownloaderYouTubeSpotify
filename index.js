import express from 'express';
const app = express();
import server, { get } from 'http';
server.createServer(app);
import path from 'path';
import ytdl from 'ytdl-core'
const host = 'localhost';
import { parse } from 'node-html-parser';
const port = 5500;
import { fileURLToPath } from 'url';
import getAccessToken from './Scripts/spotifyScripts.js';
import { getSongName } from './Scripts/spotifyScripts.js';
import { getSongArtist } from './Scripts/spotifyScripts.js';
import { searchSong } from './Scripts/youtubeScripts.js';
import { searchSingleSong } from './Scripts/youtubeScripts.js';
import { recognzieSpotifyLink } from './Scripts/spotifyScripts.js';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffmetadata from 'ffmetadata';
import { deleteFile } from './Scripts/script.js';
import { getSongNameAndArtist } from './Scripts/spotifyScripts.js';
import fs from 'fs';




ffmpeg.setFfmpegPath(ffmpegPath);
const __filename = fileURLToPath(import.meta.url);
const outputFilePath = '/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/';
app.use(express.json()); //Accept data in json format
app.use(express.urlencoded()); //Decode the data send through html form
app.use(express.static('public'));
app.use(express.static(path.join('public')));


app.get((req, res) => {
    res.sendFile('/Users/umbertofrancescocarolini/Desktop/PROGRAMMAZIONE/SITO_SERVER_YTSP_DOWN/public/index.html');
});
app.get('/formSp', (req, res) => {
    res.sendFile(path.join('/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/public/spotifyDown.html'));
});
app.get('/formYt', (req, res) => {
    res.sendFile(path.join('/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/public/youtubeDown.html'));
});
app.get('/downloadBySongName', async (req, res) => {
    res.sendFile(path.join('/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/public/index.html'));
});
app.get('/downloadSong', async (req, res) => {
    res.sendFile(path.join('/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/public/index.html'));
});
//YT downloader
app.post('/formYt', async (req, res) => {
    //Get the song's link of the request
    const link = req.body.link;
    //Get the song name by checking the link
    try {
        const songName = (await ytdl.getInfo(link)).videoDetails.title;
        res.setHeader('Content-disposition', 'attachment; filename=' + songName + '.mp3');
        res.setHeader('Content-type', 'application/octet-stream');
        const artist = (await ytdl.getInfo(link)).videoDetails.author.name;
        console.log(songName);
        console.log(artist);
        res.attachment(songName + '.mp3')
        //Download the song
        const stream = ytdl(link, { filter: "audioonly", quality: "highestaudio" })
        const outputFilePathDown = outputFilePath + songName + '.mp3';
        ffmpeg(stream)
            .audioCodec('libmp3lame')
            .format('mp3')
            .output(outputFilePathDown)
            .on('end', () => {
                const metadata = {
                    title: songName,
                    artist: artist
                }
                console.log('Download and conversion completed!');
                ffmetadata.write(outputFilePathDown, metadata, function (err) {
                    if (err) {
                        console.error('Error updating metadata:', err);
                    } else {
                        console.log('Metadata updated successfully!');
                    }
                });
                setTimeout(() => {
                    res.download(outputFilePathDown);
                }, 1500);
            })
            .on('error', (err) => console.error(err))
            .save(outputFilePathDown)
        res.on('finish', () => {
            deleteFile(outputFilePathDown);
            console.log('File deleted');
        });
        return link;
    } catch (error) {
        res.redirect('/formYt');
        console.log(error.message);
    }

});

//SP downloader
app.post('/formSp', async (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=' + 'download.mp3');
    res.setHeader('Content-type', 'application/octet-stream');
    //Get the song's link of the request
    const link = req.body.link;
    // const songName = await getSongName(link);
    getAccessToken();
    try {
        var linkType = recognzieSpotifyLink(link);
    } catch (error) {
        console.log(error.message);
        res.redirect('/formSp');
    }
    //Download by song's link
    if (linkType == 'track') {
        const songName = await getSongName(link);
        const songArtist = await getSongArtist(link);
        var songToSearch = songName + ' ' + songArtist + ' original video';
        const songLink = await searchSingleSong(songToSearch);
        const songNameOriginal = (await ytdl.getInfo(songLink)).videoDetails.title;
        console.log(`Link YT: ${songLink}`);
        res.setHeader('Content-disposition', 'attachment; filename=' + songNameOriginal + '.mp3');
        res.setHeader('Content-type', 'application/octet-stream');
        res.attachment(songNameOriginal + '.mp3');
        // ytdl(songLink, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
        const stream = ytdl(songLink, { filter: "audioonly", quality: "highestaudio" })
        const outputFilePathDown = outputFilePath + songNameOriginal + '.mp3';
        ffmpeg(stream)
            .audioCodec('libmp3lame')
            .format('mp3')
            .output(outputFilePathDown)
            .on('end', () => {
                const metadata = {
                    title: songNameOriginal,
                    artist: songArtist
                }
                console.log('Download and conversion completed!');
                ffmetadata.write(outputFilePathDown, metadata, function (err) {
                    if (err) {
                        console.error('Error updating metadata:', err);
                    } else {
                        console.log('Metadata updated successfully!');
                    }
                });
                setTimeout(() => {
                    res.download(outputFilePathDown);
                }, 1500);
            })
            .on('error', (err) => console.error(err))
            .save(outputFilePathDown)
        // setTimeout(() => {
        //     deleteFile(outputFilePathDown);
        //     console.log('File deleted');
        // }, 5000);
        res.on('finish', () => {
            deleteFile(outputFilePathDown);
            console.log('File deleted');          
        });
    }
    else if (linkType == 'playlist') {
        var songNamesAndArtists = await getSongNameAndArtist(link);
        console.log(songNamesAndArtists);
        console.log(songNamesAndArtists.length);
        for (let i = 0; i < songNamesAndArtists.length; i++) {
            var songToSearch = songNamesAndArtists[i] + ' original video';
            const songLink = await searchSingleSong(songToSearch);
            //const songNameOriginal = (await ytdl.getInfo(songLink)).videoDetails.title;
            console.log(`Link YT: ${songLink}`);

            //CONTINUA DA QUI

        }
    }
});
//SONG NAME downloader
app.post('/downloadBySongName', async (req, res) => {
    //Get the song's link of the request
    const songName = req.body.songName;
        var songToSearch = songName + ' original song';
        const searchResult = await searchSong(songToSearch);
        var songsTitles = searchResult[0];
        var songLinks = searchResult[1];
        var thumbnailUrls = searchResult[2];
        var songAuthors = searchResult[3];
        fs.readFile('/Users/umbertofrancescocarolini/Desktop/Programmazione/SITO_SERVER_YTSP_DOWN/public/index.html', 'utf8', function (err, data) {
            if (err) throw err;
            var root = parse(data);
            const body = root.getElementById('vertical-menu')
            body.setAttribute('style', 'background-color: #166818;');
            body.setAttribute('style', 'height: 280px;');
            // root.getElementById('main').setAttribute('style', 'flex-direction: column;');
            for (var i = 0; i < songsTitles.length; i++) {
                const song = parse(`
                <li class="singleSong">
                <div class="singleSongContainer">
                    <div class="songThumbnailContainer">
                        <img src="${thumbnailUrls[i]}" class="songThumbnail" alt="">
                    </div>
                    <div class="songInfo">
                        <div class="songDetailTitle">
                            <p class="songTitle">${songsTitles[i]}</p>
                        </div>
                        <div class="songDetailAuthor">
                            <p class="songAuthor">Canale: ${songAuthors[i]}</p>
                        </div>
                        <div class="songDetailDownload">
                            <button type="submit" class="buttonDownloadSongNameBoh" name="linkButton" id="linkButton" value="${songLinks[i]}" >Download</button>
                        </div>
                    </div>
                </div>
                </li>`);
                body.appendChild(song);
            }
            body.appendChild(parse(`<script src="script.js"></script>`));
            //console.log(root.toString());
            res.send(root.toString());
        });
});
app.post('/downloadSong', async (req, res) => {
    const songLink = req.body.linkButton;
    console.log(`Received link on the backend in downloadSong: ${songLink}`);
    const songNameOriginal = (await ytdl.getInfo(songLink)).videoDetails.title;
    const artist = (await ytdl.getInfo(songLink)).videoDetails.author.name;
    console.log(`Artista: ${artist}`);
    res.setHeader('Content-disposition', 'attachment; filename=' + songNameOriginal + '.mp3');
    res.setHeader('Content-type', 'application/octet-stream');
    console.log(`Link YT: ${songLink}`);
    res.attachment(songNameOriginal + '.mp3');
    const stream = ytdl(songLink, { filter: "audioonly", quality: "highestaudio" })
    const outputFilePathDown = outputFilePath + songNameOriginal + '.mp3';
    ffmpeg(stream)
        .audioCodec('libmp3lame')
        .format('mp3')
        .output(outputFilePathDown)
        .on('end', () => {
            const metadata = {
                title: songNameOriginal,
                artist: artist
            }
            console.log('Download and conversion completed!');
            ffmetadata.write(outputFilePathDown, metadata, function (err) {
                if (err) {
                    console.error('Error updating metadata:', err);
                } else {
                    console.log('Metadata updated successfully!');
                }
            });
            setTimeout(() => {
                res.download(outputFilePathDown);
            }, 1500);
        })
        .on('error', (err) => console.error(err))
        .save(outputFilePathDown)
    res.on('finish', () => {
        deleteFile(outputFilePathDown);
        console.log('File deleted');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});