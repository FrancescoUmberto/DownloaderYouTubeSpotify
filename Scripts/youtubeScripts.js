import axios from "axios";

//Function to get the song link by giving the song name
export async function searchSingleSong(songName) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                //AIzaSyCCkEVStWKpMF3dus7uCi0VCqet1FauIuU (youtubespotify)
                //AIzaSyBpXRtb372SiP3iy2yE1ToTTaJySGv9bmo (seconYtDown)
                //AIzaSyAjBOmpdadRc1o1_iOAkQbEJYwe2o-73eE (sitoprova)
                key: 'AIzaSyAjBOmpdadRc1o1_iOAkQbEJYwe2o-73eE',
                q: songName,
                part: 'snippet',
                type: 'video',
                maxResults: 1
            }
        });
        const song = response.data.items.map((item) => {
            return {
                title: item.snippet.title,
                id: item.id.videoId
            }
        });
        var videoId = response.data.items[0].id.videoId;
        var songLink = `https://www.youtube.com/watch?v=${videoId}`;
    } catch (error) {
        console.log(error.message);
    }
    return songLink;
}

//This search for the first 5 songs
export async function searchSong(songName) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                //AIzaSyCCkEVStWKpMF3dus7uCi0VCqet1FauIuU (youtubespotify)
                //AIzaSyBpXRtb372SiP3iy2yE1ToTTaJySGv9bmo (seconYtDown)
                //AIzaSyAjBOmpdadRc1o1_iOAkQbEJYwe2o-73eE (sitoprova)
                key: 'AIzaSyDq2ofgRFeQs6FOJVxOXlRGzt3nsHVQZ_I',
                q: songName,
                part: 'snippet',
                type: 'video',
                maxResults: 5
                
            }
        });
        const songs = response.data.items.map((item) => {
            return {
                title: item.snippet.title,
                id: item.id.videoId
            }
        });
        var songsTitles = [];
        var songLinks = [];
        var thumbnailUrls = [];
        var songAuthors = [];
        for (var i = 0; i < songs.length; i++) {
            var videoId = response.data.items[i].id.videoId;
            var songLink = `https://www.youtube.com/watch?v=${videoId}`;
            var thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            var songTitle = response.data.items[i].snippet.title;
            var songAuthor = response.data.items[i].snippet.channelTitle;
            songsTitles.push(songTitle);
            songLinks.push(songLink);
            thumbnailUrls.push(thumbnailUrl);
            songAuthors.push(songAuthor);
        }
    } catch (error) {
        console.log(error.message);
    }
    return [songsTitles, songLinks, thumbnailUrls, songAuthors];
}


// export function searchSingleSong(songName) {
//     try {
//         const response = axios.get(`https://www.googleapis.com/youtube/v3/search`, {
//             params: {
//                 //AIzaSyCCkEVStWKpMF3dus7uCi0VCqet1FauIuU (youtubespotify)
//                 //AIzaSyBpXRtb372SiP3iy2yE1ToTTaJySGv9bmo (seconYtDown)
//                 //AIzaSyAjBOmpdadRc1o1_iOAkQbEJYwe2o-73eE (sitoprova)
//                 key: 'AIzaSyAjBOmpdadRc1o1_iOAkQbEJYwe2o-73eE',
//                 q: songName,
//                 part: 'snippet',
//                 type: 'video',
//                 maxResults: 1
//             }
//         });
//         const song = response.data.items.map((item) => {
//             return {
//                 title: item.snippet.title,
//                 id: item.id.videoId
//             }
//         });
//         var videoId = response.data.items[0].id.videoId;
//         var songLink = `https://www.youtube.com/watch?v=${videoId}`;
//     } catch (error) {
//         console.log(error.message);
//     }
//     return songLink;
// }

//Function still not used/ended
function ytDownload(link) {
    fs.readFile('/Users/umbertofrancescocarolini/Desktop/PROGRAMMAZIONE/SITO_SERVER_YTSP_DOWN/link.json', function (err, data) {
        if (err) {
            console.log(err);
        }
        let links = JSON.parse(data);
        links.push(link);
        fs.writeFile('/Users/umbertofrancescocarolini/Desktop/PROGRAMMAZIONE/SITO_SERVER_YTSP_DOWN/link.json', JSON.stringify(links), function (err) {
            if (err) {
                console.log(err);
            }
        })
    })
};

// export async function searchSongLink(songName){
//     try{
//         const searchResults = await ytdl.(songName);

//         const firstResult = searchResults[0];
//         if (firstResult){
//             return firstResult.link;
//         }
//         else{
//             throw new Error("No results found");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

export default searchSong;










// import google from 'googleapis';
// var OAuth2 = google.auth.OAuth2;

// import { GoogleAuth } from 'google-auth-library';
// //set the auth
// const auth = new GoogleAuth({
//     keyFile: 'AIzaSyDfKgCGZ1v8dY-3OHK-daBqUit2rriSwto',
//     scopes: 'https://www.googleapis.com/auth/youtube.readonly',
// });
// //Create a yt api
// const youtube = google.youtube({
//     version: 'v3',
//     auth: auth,
// });

// export async function getYouTubeLink(songName){
//     try{
//         const response = await youtube.search.list({
//             part: 'snippet',
//             q: songName,
//             type: 'video',
//             maxResults: 1,
//         });
//         const videoId = response.data.items[0].id.videoId;
//         const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
//         return youtubeLink;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }
