import React, { useEffect, useState } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import Forecast from "./forecast";


const dateBuilder = (d) => {
	let months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
	color: "white",
	size: 112,
	animate: true,
};



const Weather = () => {

	const [lat,setLat] = useState(undefined);
	const [lon,setlon] = useState(undefined);
	const [city,setCity] = useState(undefined);
	const [country,setCountry] = useState(undefined);
	const [icon,setIcon] = useState("CLEAR_DAY");
	const [temperatureC,setTemperatureC] = useState(undefined);
	const [main,setMain] = useState(undefined);

	const getPosition = (options) => {
		return new Promise(function (resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
  	};

	const  getWeather = async (lat, lon) => {

		const api_call = await fetch(
			`${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
		);

		const data = await api_call.json();


		setLat(lat);
		setlon(lon);
		setCity(data.name);
		setMain(data.weather[0].main);
		setCountry(data.sys.country)
		setTemperatureC(Math.round(data.main.temp));

		switch (main) {
			case "Haze":
				setIcon("CLEAR_DAY");
				break;
			case "Clouds":
				setIcon("CLOUDY");
				break;
			case "Rain":
				setIcon("RAIN");
				break;
			case "Snow":
				setIcon("SNOW");
				break;
			case "Dust":
				setIcon("WIND");
				break;
			case "Drizzle":
				setIcon("SLEET");
				break;
			case "Fog":
				setIcon("FOG");
				break;
			case "Smoke":
				setIcon("FOG");
				break;
			case "Tornado":
				setIcon("WIND");
				break;
			default:
				setIcon("CLEAR_DAY");
		}
  	};

	useEffect(()=>{
		if (navigator.geolocation) {
			getPosition()
				//If user allow location service then will fetch data & send it to get-weather function.
				.then((position) => {
					getWeather(position.coords.latitude, position.coords.longitude);
				})
				.catch((err) => {
					//If user denied location service then standard location weather will le shown on basis of latitude & latitude.
					getWeather(28.67, 77.22);
					alert(
						"You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
					);
				});
		} else {
		alert("Geolocation not available");
		}

		const timerID = setInterval(
		() => getWeather(lat, lon),
		60000000
		);

		return ()=>{
			clearInterval(timerID);
		}

	},[])

	return (
		temperatureC ?
		<React.Fragment>
			<div className="city">
			<div className="title">
				<h2>{city}</h2>
				<h3>{country}</h3>
			</div>
			<div className="mb-icon">
				{" "}
				<ReactAnimatedWeather
				icon={icon}
				color={defaults.color}
				size={defaults.size}
				animate={defaults.animate}
				/>
				<p>{main}</p>
			</div>
				<div className="date-time">
					<div className="dmy">
						<div id="txt"></div>
						<div className="current-time">
							<Clock format="HH:mm:ss" interval={1000} ticking={true} />
						</div>
						<div className="current-date">{dateBuilder(new Date())}</div>
					</div>
					<div className="temperature">
						<p>
							{temperatureC}°<span>C</span>
						</p>
						{/* <span className="slash">/</span>
						{this.state.temperatureF} &deg;F */}
					</div>
				</div>
			</div>
			<Forecast icon={icon} weather={main} />
		</React.Fragment>:
		<React.Fragment>
			<img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
			<h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
				Detecting your location
			</h3>
			<h3 style={{ color: "white", marginTop: "10px" }}>
				Your current location wil be displayed on the App <br></br> & used
				for calculating Real time weather.
			</h3>
		</React.Fragment>
	)

}

export default Weather;
