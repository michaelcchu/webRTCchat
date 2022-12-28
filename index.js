const button = document.getElementById("button");
const offer = document.getElementById("offer");
const answer = document.getElementById("answer");
const chat = document.getElementById("chat");

const config = {iceServers: [{urls: "stun:stun.1.google.com:19302"}]};
const pc = new RTCPeerConnection(config);
const dc = pc.createDataChannel("chatchannel", {negotiated: true, id: 0});

dc.addEventListener("message", (e) => { console.log(e.data); });
pc.addEventListener("icecandidate", ({candidate}) => {
  if (candidate) return;
  console.log(pc.localDescription.sdp);
});
button.addEventListener("click", () => {
  button.disabled = true;
  pc.setLocalDescription(pc.createOffer());
});
offer.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") { return; }
  if (pc.signalingState !== "stable") { return; }
  button.disabled = offer.disabled = true;
  pc.setRemoteDescription({type: "offer", sdp: offer.value.trim()+"\r\n"});
  pc.setLocalDescription(pc.createAnswer());
});
answer.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") { return; }
  if (pc.signalingState !== "have-local-offer") { return; }
  answer.disabled = true;
  pc.setRemoteDescription({type: "answer", sdp: answer.value.trim()+"\r\n"});
})
chat.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") { return; }
  dc.send(chat.value);
  console.log(chat.value);
  chat.value = "";
});