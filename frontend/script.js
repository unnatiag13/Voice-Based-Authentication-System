let mediaRecorder;
let audioChunks = [];

async function startRecording(){

audioChunks=[];

const wave=document.getElementById("wave");
wave.style.opacity=1;

document.getElementById("status").innerText="🎙 Recording...";

const stream=await navigator.mediaDevices.getUserMedia({audio:true});

mediaRecorder=new MediaRecorder(stream);

mediaRecorder.start();

mediaRecorder.ondataavailable=e=>{
audioChunks.push(e.data);
};

setTimeout(()=>{

mediaRecorder.stop();

wave.style.opacity=0;

document.getElementById("status").innerText="✔ Recording finished";

},3000);

}

function login(){

if(audioChunks.length==0){
alert("Record voice first");
return;
}

document.getElementById("status").innerText="🔄 Verifying voice...";

const audioBlob=new Blob(audioChunks,{type:"audio/wav"});

const formData=new FormData();

formData.append("audio",audioBlob);

fetch("/verify",{
method:"POST",
body:formData
})
.then(res=>res.json())
.then(data=>{
document.getElementById("status").innerText="✅ "+data.message;
})
.catch(()=>{
document.getElementById("status").innerText="❌ Verification failed";
});

}