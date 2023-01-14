const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
locationBtn = inputPart.querySelector("button"),
inputField = inputPart.querySelector("input")
bckButton = wrapper.querySelector("header i");
wIcon = document.querySelector(".weather-part img");

let api;
inputField.addEventListener("keyup", e=>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value)
    }
})
locationBtn.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        alert("Your Browser does not support Geolocation Api");
    }
})
bckButton.addEventListener("click",()=>{
    wrapper.classList.remove("active");
})

function onSuccess(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=b4c6dda4cf299d24ea5356d823663243`
    fetchData();
}
function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b4c6dda4cf299d24ea5356d823663243`;
    fetchData();
}
function fetchData(){
    infoTxt.innerText = "Getting Weather Details....."
    infoTxt.classList.add("pending");
    fetch(api).then(respone=>respone.json()).then(result=>weatherDetails(result));
}

function weatherDetails(details){
    infoTxt.classList.replace("pending","error");
    if(details.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name.`
    }else{
        console.log(details);
        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        const city = details.name;
        const country = details.sys.country;
        const {description,id} = details.weather[0];
        const {feels_like,humidity,temp} = details.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id>=200 && id<=232){
            wIcon.src = "icons/strom.svg";
        }else if(id>=600 && id<=622){
            wIcon.src = "icons/snow.svg";
        }else if(id>=701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id>=801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 300  && id <=321) || (id>=500 && id<=531)){
            wIcon.src = "icons/rain.svg";
        }

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city} ${country}`;
        wrapper.querySelector(".temp .numb1").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        console.log(details);
    }
}