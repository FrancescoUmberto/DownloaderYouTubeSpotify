import axios from "axios";
import spotifyWebApi from "spotify-web-api-node";


//Spotify API
const clientId = '331613cbcbb046d480cef166acd56e8c';
const clientSecret = '04984055c5b74d71b814f5c469426af9';
const spotifyApi = new spotifyWebApi({ clientId, clientSecret });



//Potrebbe essere interessante
// export function recognzieLink(link) {  
//     if (link.includes('spotify')) {
//         return 'spotify';
//     } else if (link.includes('youtube')) {
//         return 'youtube';
//     } else {
//         throw new Error('Invalid link');
//     }
// }

//Function to get the songName and songArtist from the spotify playlist's link
export async function getSongNameAndArtist(link) {
    const playlistId = getPlaylistIdFromLink(link);
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const tracks = response.data.tracks.items;
    const songNames = tracks.map(track => track.track.name);
    const songArtists = tracks.map(track => track.track.artists[0].name);
    var songNamesAndArtists = [];
    for (let i = 0; i < songNames.length; i++) {
        // console.log(`${songNames[i]} - ${songArtists[i]}`);
        songNamesAndArtists.push(`${songNames[i]} - ${songArtists[i]}`);
    }
    return songNamesAndArtists;
}

//Function to recognize the type of the link
export function recognzieSpotifyLink(link) {
    const playlistRegex = /^https:\/\/open.spotify.com\/playlist\/([a-zA-Z0-9]+).*$/;
    const trackRegex = /^https:\/\/open.spotify.com\/track\/([a-zA-Z0-9]+).*$/;
    var valid = true;
    if (link.match(playlistRegex)) {
        console.log('playlist');
        return 'playlist';
    }
    else if (link.match(trackRegex)) {
        console.log('track');
        return 'track';
    }
    else {
        valid = false;
        throw new Error('Invalid link');
    }
}

function getPlaylistIdFromLink(link) {
    const match = link.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('Invalid playlist link');
}


export async function getAccessToken() {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
        });
        const accessToken = response.data.access_token;
        // console.log(`Access Token: ${accessToken}`);
        return accessToken;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
//function to get the song name frome the spotify's link
export async function getSongName(link) {
    const songId = link.split('/')[4];
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${songId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const songName = response.data.name;
    console.log(songName);
    return songName;
};
export async function getSongArtist(link) {
    try {
        const regex = /track\/(.+)/;
        const match = link.match(regex);
        if (match && match[1]) {
            const trackId = match[1];
            const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            const artistName = response.data.artists[0].name;
            console.log(artistName);
            return artistName;
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default getAccessToken;


