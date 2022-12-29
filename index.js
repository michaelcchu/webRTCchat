const offer = document.getElementById("offer");
const answer = document.getElementById("answer");
const text = document.getElementById("text");
const chat = document.getElementById("chat");
const display = document.getElementById("display");
const config = {iceServers: [
  {
    urls: "stun:stun.1.google.com:19302"
  },
  {
    urls: "stun:relay.metered.ca:80",
  },
  {
    urls: "turn:relay.metered.ca:80",
    username: "840429176db5ad56ce6c859b",
    credential: "13iM7/0UZL021lcB",
  },
  {
    urls: "turn:relay.metered.ca:443",
    username: "840429176db5ad56ce6c859b",
    credential: "13iM7/0UZL021lcB",
  },
  {
    urls: "turn:relay.metered.ca:443?transport=tcp",
    username: "840429176db5ad56ce6c859b",
    credential: "13iM7/0UZL021lcB",
  }
]};
const pc = new RTCPeerConnection(config);
const dc = pc.createDataChannel("chatchannel", {negotiated: true, id: 0});
dc.addEventListener("message", (e) => {
  display.innerHTML += "< " + e.data + "\n";
});
dc.addEventListener("open", () => {
  chat.disabled = false;
});
pc.addEventListener("icecandidate", ({candidate}) => {
  console.log(candidate);
  if (candidate) {return;} 
  offer.disabled = true;
  display.innerHTML = pc.localDescription.sdp;
});
offer.addEventListener("click", () => {
  pc.setLocalDescription(pc.createOffer());
});
answer.addEventListener("click", () => {
  answer.disabled = text.disabled = true;
  if (pc.signalingState === "stable") {
    pc.setRemoteDescription({type: "offer", sdp: text.value.trim() + "\n"});
    pc.setLocalDescription(pc.createAnswer());
  } else {
    pc.setRemoteDescription({type: "answer", sdp: text.value.trim() + "\n"});
  }
});
text.addEventListener("input", () => { 
  offer.disabled = true; answer.disabled = false;
});
chat.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") {return;}
  dc.send(chat.value);
  display.innerHTML += "> " + chat.value + "\n";
  chat.value = "";
});