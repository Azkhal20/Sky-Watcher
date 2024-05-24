// Get all necessary elements form the DOM
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.querySelector("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelector(".city");

// Default city ketika halaman di muat
let cityInput = "London";

//Menambahkan event click ke setiap kota dalam panel
cities.forEach((city) => {
    city.addEventListener("click", (e) => {
    // Ubah dari default kota ke kota yang dipilih
    cityInput = e.target.innerHTML;
    // Function that fetches and displays all the data from the wheather API 
    fetchWeatherData();
    // Fade out the app (simple animation)
    app.style.opacity = "0";
    });
});

// Menambahkan event kirim ke form
form.addEventListener("submit", (e) => {
    // Jika tempat input (search bar) kosong, maka muncul alert
    if (search.value.length == 0) {
        alert("Please type the city name first!");
    } else {
        // Ubah dari kota default ke kota yang telah di tulis dalam kotak input
        cityInput = search.value;
        // Function that fetches and displays all the data from the wheather API 
        fetchWeatherData();
        // Memudarkan aplikasi (simple animation)
        search.value = "";
        // Memudarkan aplikasi (simple animation)
        app.style.opacity = "0";
    }

    // Prevent the default behaviour of the form
    e.preventDefault();
});

// Function yang mengembalikan hari dalam seminggu (Senin, Selasa Jumat...) dari tanggal (12 03 2021)
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

// Function yang mengambil dan menampilkan semua data dari Weather API
function fetchWeatherData() {
// Fetch the data and dynamicaly add the city name with template literals
// Gunakan Key milikmu
fetch(`http://api.weatherapi.com/v1/current.json?key=6a7e2e9c0d3a4e5f9b1e1e1e1e1e1e1e&q=${cityInput}`)
    // Take the data (Which is in JSON format) and convert it to a JS object
    .then(response => response.json())
    .then(data => {
        // You can console.log(data) to see what is available
        console.log(data);
    
        // Menambahkan temperature dan kondisi cuaca
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        // Mengambil tanggal dan waktu dari kota dan mengekstrak hari, bulan dan tahun ke individual variable
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        // Mengganti format dari tanggal dan waktu yang diperoleh dari API ke format yang lebih mudah dibaca
        // Default format: 2021-10-09 17:53
        // New format: 17:53 - Friday 9. 10 2021
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;
        // Menambahkan nama kota ke dalam page
        nameOutput.innerHTML = data.location.name;
        // Mendapatkan url icon yang sesuai dengan cuaca
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length);
        // Reformat URL icon ke dalam folder lokal, lalu menambahkan icon ke dalam halaman
        icon.src = "./icons/" + iconId;

        // menambahkan detail cuaca
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // Atur waktu hari  default
        let timeOfDay = "day";
        // Mendapatkan id unique dari kondisi cuaca
        const code = data.current.condition.code;

        // Mengubah ke malah hari jika sudah waktu malam di kota
        if(!data.current.is_day) {
            timeOfDay = "night";
        }

        if(code == 1000) {
            // mengatur cuaca ke clear, jika cuacanya clear
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/clear.jpg)`
            // Mengubah warna button tergantung cauca siang atau malam
            btn.style.background = '#e5ba92';
            if(timeOfDay == "night") {
                btn.style.background = '#181e27';
            }
        }
        
        // CLoudy Weather
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282
        ) {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/cloudy.jpg)`
            btn.style.background = "#fa6d1b";
            if(timeOfDay == "night") {
                btn.style.background = '#181e27';
            }
            
        // Rainy Weather
        } else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ) {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/rainy.jpg)`
            btn.style.background = "#647d75";
            if(timeOfDay == "night") {
                btn.style.background = '#325c80';
            }

        // Snowy Weather
        } else {
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/snowy.jpg)`
            btn.style.background = "#4d72aa";
            if(timeOfDay == "night") {
                btn.style.background = '#1b1b1b';
            }
        }

        // mengfadekan halaman setelah semuanya selesai
        app.style.opacity = "1";
    })
    // Jika nama kota tidak ditemukan, maka muncul alert
    .catch(() => {
        alert('Kota tidak ditemukan, silahkan masukkan nama kota lain!');
        app.style.opacity = "1";
    });
}
    
    // Memanggil function dalam page load
    fetchWeatherData();

    // Mengfadekan halaman
    app.style.opacity = "1";