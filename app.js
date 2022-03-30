const express = require('express');
const hbs = require('hbs');
require('dotenv').config();

var app = express();

app.set('view engine', 'hbs')
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));

let lat,lng,battery_level,range_available,device_name,bat_percentage;

function calc_range(battery_level) {
    let range;
    if (battery_level >= 90 && battery_level <= 100) {
        range = "10km";
    }
    else if (battery_level >= 80 && battery_level <= 89) {
        range = "9km";
    }
    else if (battery_level >= 70 && battery_level <= 79) {
        range = "8km";
    }
    else if (battery_level >= 60 && battery_level <= 69) {
        range = "7km";
    }
    else if (battery_level >= 50 && battery_level <= 59) {
        range = "6km";
    }
    else if (battery_level >= 40 && battery_level <= 49) {
        range = "5km";
    }
    else if (battery_level >= 30 && battery_level <= 39) {
        range = "4km";
    }
    else if (battery_level >= 20 && battery_level <= 29) {
        range = "3km";
    }
    else{
        range = "please charge the battery";
    }
    return range;
}

app.post('/update', (req, res)=>{
    console.log(req.body.lat);
    lat = req.body.lat;
    lng = req.body.lng;
    device_name = req.body.device;
    battery_level = req.body.bat_percentage;
    range_available = calc_range(parseInt(battery_level));
    res.status(200).send("Success");         
});

app.post('/new_card', (req, res)=>{
    if(req.body.lat2){
    let lat1=lat, lon1=lng, lat2=req.body.lat2, lon2=req.body.lon2;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    const km = d*(Math.pow(10,-3));
    console.log(km);
    if(km<100){
        res.status(200).send({range:"inrange",lati:lat1,long:lon1,battery_level:battery_level,range_available:range_available,device_name:device_name,bat_percentage:bat_percentage});
    }else{
        res.status(200).send({range:"outrange"});
    }
    }else{
        res.status(400).send("no data from geolocation api");
    }
})

app.get('/', (req, res)=>{
    res.render('home');
})


const PORT = process.env.PORT;

app.listen(PORT, console.log(
    `Server started on port ${PORT}`));