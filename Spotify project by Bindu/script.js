console.log('Lets write Javascript');
async function()
{
let a=await fetch("")
let response=await a.text();
console.log(response)
let div=document.createElement("div")
div.innerHTML=response;
let as=div.getElementsByTagName("a")
let songs=[]
for(let index=0;index<as.length;index++)
{
    const element=as[index];
    if(element.href.endsWith(".mp3"))
    {
        songs.push(element.href.split("/songs/"[1]))
    }
}
return songs
}
async function main()
{
let songs=await getsongs()
console.log(songs)
let songUL=document.querySelector(".songlist").getElementsByTagName("ul")
for(const song of songs)
{
    songUL.innerHTML=songUL.innerHTML+'<li> ${song.replaceAll1111111111111111111111111111111111111`("%20%"," ")}</li>';
}
var audio = new Audio(songs[0]);
audio.play();
audio.addEventListner ("ontimeupdate",()=>{
    let duration=audio.duration;
    console.log(audio.duration,audio.currentSrc,audio.currentTime)
});
}
main()