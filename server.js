// load the things we need
const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const alert = require('alert-node');
var date;
const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
	  "July", "Aug", "Sept", "Oct", "Nov", "Dec"
	];
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// index page 
app.get('/', function(req, res) {
	if(req.query.city != undefined) var city = req.query.city;
	else var city = 'London';
	request(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=b426518bb424b1e120860f5f96113613`, { json: true }, (error, response, body) => {
	 	if (error) { return console.log(error); }
	 	if(body.list != undefined) {
	 		var weather_forecast = [];
		 	var max = body.list[0].main.temp_max;
		 	var min = body.list[0].main.temp_min;
		 	for(var obj in body.list) {
		 		if(body.list[obj].main.temp_max > max) max = body.list[obj].main.temp_max;
		 		if(body.list[obj].main.temp_min < min) min = body.list[obj].main.temp_min;
		 		var d = new Date(body.list[obj].dt*1000);
		 		if(typeof date == undefined || date != d.getDate()) {
		 			date = d.getDate();
		 			weather_forecast.push({
		 				city : city,
				 		date: monthNames[d.getMonth()] + " " +d.getDate(),
			            temperature : Math.round(body.list[obj].main.temp),
			            temp_min : Math.round(min),
			            temp_max : Math.round(max),
			            humidity : Math.round(body.list[obj].main.humidity),
			            description : body.list[obj].weather[0].description,
			            icon : body.list[obj].weather[0].icon
		 			});
		 		}
		 	}
			var weather_data = {weather: weather_forecast};
			res.render('index', weather_data);
			res.end();
	 	}
	 	else {
	 		alert("Please enter a valid city name");
	 	}
	});
});

app.post('/', function(req, res) {
  var city = req.body.city_name;
  if(city != "" && city != undefined) {
  	res.redirect('/?city='+city);
  }
  else {
  	alert("Please enter a city name...");
  }
});

app.listen(8080);
console.log('8080 is the magic port');