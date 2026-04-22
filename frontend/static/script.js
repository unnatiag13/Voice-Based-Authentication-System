// SPA navigation

function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active")
})

document.getElementById(page).classList.add("active")

}


// LOGIN SIMULATION

function startLogin(){

let status=document.getElementById("loginStatus")

status.innerText="Recording..."

setTimeout(()=>{

status.innerText="Analyzing Voice..."

setTimeout(()=>{

if(Math.random()>0.5){

status.innerText="✔ Authentication Successful"

}else{

status.innerText="❌ Voice Not Recognized"

}

},2000)

},2000)

}


// REGISTER

let recordings=0

function recordVoice(){

if(recordings>=4)return

recordings++

document.getElementById("recordText").innerText="Recordings: "+recordings+" / 4"

document.getElementById("bar").style.width=(recordings*25)+"%"

if(recordings===4){

document.getElementById("registerBtn").disabled=false

}

}