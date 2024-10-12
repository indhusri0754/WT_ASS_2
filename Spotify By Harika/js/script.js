console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs = [];
let currFolder;

// Function to format seconds into MM:SS
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Update song details in the display
function updateSongDetails(songTitle, currentTime, totalTime) {
    document.getElementById("song-name").textContent = songTitle;
    document.getElementById("current-time").textContent = currentTime;
    document.getElementById("total-time").textContent = totalTime;
}

// Play the selected song

    // JavaScript function to play song and update song name
function playSong(songId) {
    // Get the audio element for the song
    const song = document.getElementById(songId);
    
    // Play the selected song
    song.play();
    
    // Pause all other songs to prevent multiple songs playing at the same time
    const songs = document.querySelectorAll('audio');
    songs.forEach(audio => {
        if (audio !== song) {
            audio.pause();
            audio.currentTime = 0; // Reset time to 0
        }
    });
    
    // Set the song name in the play box
    let songName = '';
    switch (songId) {
        case 'song1':
            songName = 'Fear Song';
            break;
        case 'song2':
            songName = 'Kadalalle';
            break;
        case 'song3':
            songName = 'Ninne Tholi Prema';
            break;
        case 'song4':
            songName = 'Sada Siva';
            break;
        default:
            songName = 'Unknown Song';
    }
    
    // Update the song name display at the bottom of the play box
    document.getElementById('song-name').innerText = songName;

     song.onloadedmetadata = function() {
        const duration = song.duration; // Get song duration in seconds
        const minutes = Math.floor(duration / 60); // Convert seconds to minutes
        const seconds = Math.floor(duration % 60); // Get remaining seconds
        
        // Format time as MM:SS
        const formattedTime = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
        
        // Update the song time display at the bottom of the play box
        document.getElementById('song-time').innerText = formattedTime;
    };
}



// Main function to manage song playback
const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg"; // Ensure the play button shows pause icon
    }

    const songTitle = decodeURI(track);
    updateSongDetails(songTitle, secondsToMinutesSeconds(0), secondsToMinutesSeconds(currentSong.duration));
    document.querySelector(".songinfo").innerHTML = songTitle;
    document.querySelector(".songtime").innerHTML = "00:00 / " + secondsToMinutesSeconds(currentSong.duration);
};

// Fetch songs from the server
async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`/${folder}/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                                <img class="invert" width="34" src="img/music.svg" alt="">
                                <div class="info">
                                    <div>${decodeURIComponent(song.replaceAll("%20", " "))}</div>
                                    <div>Harry</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="img/play.svg" alt="">
                                </div>
                             </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    return songs;
}

// Display albums on the page
async function displayAlbums() {
    console.log("displaying albums");
    let response = await fetch(`/songs/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    for (let e of anchors) {
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            // Get the metadata of the folder
            let folderResponse = await fetch(`/songs/${folder}/info.json`);
            let folderInfo = await folderResponse.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                                            <div class="play">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <img src="/songs/${folder}/cover.jpg" alt="">
                                            <h2>${folderInfo.title}</h2>
                                            <p>${folderInfo.description}</p>
                                        </div>`;
        }
    }

    // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

// Main application function
async function main() {
    await getSongs("songs/ncs"); // Load default songs
    playMusic(songs[0], true); // Start playing the first song

    await displayAlbums(); // Display albums

    // Attach event listeners for play, next, and previous
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        const currentTimeFormatted = secondsToMinutesSeconds(currentSong.currentTime);
        const totalTimeFormatted = secondsToMinutesSeconds(currentSong.duration);
        updateSongDetails(document.querySelector(".songinfo").innerHTML, currentTimeFormatted, totalTimeFormatted);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Add event listeners for hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous song button functionality
    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // Next song button functionality
    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
// Attach event listeners for play, next, and previous
// Attach event listeners for play, next, and previous
document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        
        // Change the play button to show the pause icon when playing
        document.getElementById("play-icon").classList.remove("fa-play");  // Remove play icon class
        document.getElementById("play-icon").classList.add("fa-pause");    // Add pause icon class
        
    } else {
        currentSong.pause();
        
        // Change the play button to show the play icon when paused
        document.getElementById("play-icon").classList.remove("fa-pause"); // Remove pause icon class
        document.getElementById("play-icon").classList.add("fa-play");     // Add play icon class
    }
});



    // Volume control
    document.querySelector(".range input").addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // Mute/unmute functionality
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
