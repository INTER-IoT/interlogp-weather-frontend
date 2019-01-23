export default {
  types: ['weather', 'emission', 'sound'],
  attributes: {
    weather: [
      'windSpeed',
      'precipitation',
      'solarRadiation',
      'pressure',
      'humidity',
      'seaTemperature',
      'averageTemperature',
      'windDirection',
    ],
    emission: [
      'particles',
      'nox',
      'so2',
      'no2',
      'no',
      'co',
    ],
    sound: [
      'maxLevel',
      'minLevel',
      'avgLevel',
    ],
  },
  operations: ['<', '<=', '=', '>=', '>'],
}
