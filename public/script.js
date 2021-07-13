const socket = io('/');
let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
let showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = true;

const peers = {}

// backBtn.addEventListener("click", () => {
//     document.querySelector(".main__left").style.display = "flex";
//     document.querySelector(".main__left").style.flex = "1";
//     document.querySelector(".main__right").style.display = "none";
//     document.querySelector(".header__back").style.display = "none";
//   });
// showChat.addEventListener("click", () => {
//   document.querySelector(".main__right").style.display = "flex";
//   document.querySelector(".main__right").style.flex = "1";
//   document.querySelector(".main__left").style.display = "none";
//   document.querySelector(".header__back").style.display = "block";
// }); 
 

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: ' https://temp-video-chat-app.herokuapp.com',
    port: '3030',
    });

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
})
.then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

peer.on('call', call => {
    call.answer(stream)
    const video= document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })
    })

socket.on('user-connected', userId =>{
    console.log("User Connected", userId);
    //connectToNewUser(userId, stream);
    setTimeout(connectToNewUser,1000,userId,stream)
})

socket.on('user-disconnected', userId=> {
  console.log(userId);
if(peers[userID]) peers[userID].close();
// this.removeVideo(userId);
})
})

peer.on('open', id=>{
socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
const call = peer.call(userId, stream)
const video = document.createElement('video')
call.on('stream', userVideoStream =>{
    addVideoStream(video, userVideoStream)
})
call.on('close', ()=>{
    video.remove()
})

peers[userId] = call;

}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
       video.play();
       videoGrid.append(video);
    });
};
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});