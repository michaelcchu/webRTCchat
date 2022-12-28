const offer = document.getElementById("offer");
const answer = document.getElementById("answer");
const text = document.getElementById("text");
const chat = document.getElementById("chat");
const display = document.getElementById("display");
const config = { iceServers: [ { urls: "stun:stun.1.google.com:19302" } ] };
const pc = new RTCPeerConnection(config);
const dc = pc.createDataChannel("chatchannel", {negotiated: true, id: 0});
dc.addEventListener("message", (e) => { 
  display.innerHTML += "> " + e.data + "\r\n"; 
});
pc.addEventListener("icecandidate", ({candidate}) => {
  if (candidate) { return; }
  offer.disabled = true;
  display.innerHTML = pc.localDescription.sdp;
});
offer.addEventListener("click", () => {
  pc.setLocalDescription(pc.createOffer());
});
answer.addEventListener("click", () => {
  answer.disabled = text.disabled = true;
  if (pc.signalingState === "stable") {
    pc.setRemoteDescription({type: "offer", sdp: text.value.trim() + "\r\n"});
    pc.setLocalDescription(pc.createAnswer());
  } else {
    pc.setRemoteDescription({type: "answer", sdp: text.value.trim() + "\r\n"});
  }
})
text.addEventListener("input", () => { offer.disabled = true; });
chat.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") { return; }
  dc.send(chat.value);
  display.innerHTML += chat.value + "\r\n";
  chat.value = "";
});