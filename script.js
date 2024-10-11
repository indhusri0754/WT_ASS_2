console.log('Lets write Javascript');
let currentSong= new Audio;
let songs;
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
async function getSongs() {
    // Fetch the songs from the specified URL
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let text = await response.text();

    console.log(text); // Log the fetched response

    // Create a div to parse the HTML response
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    let songs = [];

    // Loop through all anchor elements
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // Correct the way to split the href to get the song name
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic = (track,pause=false)=>{
    currentSong.src ="/songs/" +track;
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
async function main() {

     songs = await getSongs(); // Call the function to get songs
    playMusic(songs[0],true)

    // Get the first ul element within the song list
    songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    // Loop through the songs and append them to the ul
    for (const song of songs) {
        songUL.innerHTML =songUL.innerHTML +`<li>
        <img class="invert" src="img/music.svg" alt=" ">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Artist</div>
        </div>
        <div class="playsong">
            <h4>Play Now</h4>
            <img class="invert" src="img/playsong.svg" alt="">
        </div>
    </li>`;
    }
    //Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML) 
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    //attach an event listner to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    //Listen for timeUpdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =`${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
    })
//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent= (e.offsetX/e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)* percent)/ 100;
})
}
// add an event listener for hambuerger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"

})
// add an event listener for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"

})
//add an event listener to previous
previous.addEventListener("click",()=>{
    console.log("Previous clicked")
    console.log(currentsong)
    let index=songs.indexof(currentsong.src.split("/").slice(-1)[0])
    console.log(songs,index)
    if((index-1)>= 0){
        
      playMusic(songs[index-1])
    }
})
//add an event listener to next 
next.addEventListener("click",()=>{
    currentSong.pause()
    console.log("Next clicked")

    let index=songs.indexof(currentsong.src.split("/").slice(-1)[0])
    console.log(songs,index)
    if((index+1)< song.length){
        
      playMusic(songs[index+1])
    }
    
})
//add an event to volumn
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
{
    console.log("Setting volume to" ,e,e.target,e.target.valu,"/100")
    currentSong.volume =parseInt(e.target.value)/100

})
    

// Start the main function
main()
