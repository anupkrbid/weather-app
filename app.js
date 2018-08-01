const axios = require( 'axios' );
const yargs = require( 'yargs' );

const argv = yargs
	.options( {
		location: {
			alias: 'l',
			demand: true,
			description: 'Location to fetch weather for',
			string: true
		}
	} )
	.help()
	.alias( 'help', 'h' )
	.argv;

const encodedLocation = encodeURIComponent( argv.location );

const GEOCODE_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}`;

axios.get( GEOCODE_API_URL ).then( ( response ) => {

	if ( response.data.status === 'ZERO_RESULTS') {
		throw new Error( 'Unable to find requested location' );
	}

	const lat = response.data.results[0].geometry.location.lat;
	const lng = response.data.results[0].geometry.location.lng;
	const DARK_SKY_SECRET_KEY = '997d04dd3622e41cebf74bf6157d21f7';
	const WEATHER_API_URL = `https://api.darksky.net/forecast/${DARK_SKY_SECRET_KEY}/${lat},${lng}`;

	console.log( '~ Weather Summary ~' );
	console.log( 'Location: ', response.data.results[0].formatted_address );

	return axios.get( WEATHER_API_URL );

} ).then( ( response ) => {

	console.log( 'Summary: ', response.data.currently.summary );
	console.log( 'Actual Temperature: ', `${response.data.currently.temperature}F` );
	console.log( 'Apparent Temperature : ', `${response.data.currently.apparentTemperature}F` );
	console.log( 'Humidity: ', `${response.data.currently.humidity * 100}%` );
	console.log( 'Wind Speed: ', `${response.data.currently.windSpeed} mph` );

} ).catch( ( error ) => {

	if ( error.code === 'ENOTFOUND' ) {
		console.log('Unable to connect to api server');
	} else {
		console.log( error.message );
	}

} );