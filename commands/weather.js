module.exports.config = {
	name: "weather",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Xem thông tin thời tiết tại khu vực",
	commandCategory: "general",
	usages: "weather [địa điểm]",
	cooldowns: 5,
	info: [
		{
			key: "địa điểm",
			prompt: "Là thành phố, khu vực",
			type: 'Văn bản',
			example: 'Hà Nội'
		}
	]
};

module.exports.run = async (api, event, args) => {
	const request = require("request");
	let OPEN_WEATHER;
	try {
		const config = require('../config.json');
		OPEN_WEATHER = config.OPENWEATHER;
	} catch (error) {
		OPEN_WEATHER = process.env.OPEN_WEATHER;
	}
	var city = args.join(" ");
	if (city.length == 0) return api.sendMessage(`Bạn chưa nhập địa điểm, hãy đọc hướng dẫn tại ${prefix}help weather!`,event.threadID, event.messageID);
	return request(encodeURI("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OPEN_WEATHER + "&units=metric&lang=vi"), (err, response, body) => {
		if (err) throw err;
		var weatherData = JSON.parse(body);
		if (weatherData.cod !== 200) return api.sendMessage(`Địa điểm ${city} không tồn tại!`, event.threadID, event.messageID);
		var sunrise_date = moment.unix(weatherData.sys.sunrise).tz("Asia/Ho_Chi_Minh");
		var sunset_date = moment.unix(weatherData.sys.sunset).tz("Asia/Ho_Chi_Minh");
		api.sendMessage({
			body: '🌡 Nhiệt độ: ' + weatherData.main.temp + '°C' + '\n' +
						'🌡 Nhiệt độ cơ thể cảm nhận được: ' + weatherData.main.feels_like + '°C' + '\n' +
						'☁️ Cảnh quan hiện tại: ' + weatherData.weather[0].description + '\n' +
						'💦 Độ ẩm: ' + weatherData.main.humidity + '%' + '\n' +
						'💨 Tốc độ gió: ' + weatherData.wind.speed + 'km/h' + '\n' +
						'🌅 Mặt trời mọc vào lúc: ' + sunrise_date.format('HH:mm:ss') + '\n' +
						'🌄 Mặt trời lặn vào lúc: ' + sunset_date.format('HH:mm:ss') + '\n',
			location: {
				latitude: weatherData.coord.lat,
				longitude: weatherData.coord.lon,
				current: true
			},
		}, event.threadID, event.messageID);
	});
}