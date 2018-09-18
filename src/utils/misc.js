

/**
  * Returns the destination point from a given point, having travelled the given distance
  * on the given initial bearing.
  *
  * @param   {number} lat - initial latitude in decimal degrees (eg. 50.123)
  * @param   {number} lon - initial longitude in decimal degrees (e.g. -4.321)
  * @param   {number} distance - Distance travelled (metres).
  * @param   {number} bearing - Initial bearing (in degrees from north).
  * @returns {array} destination point as [latitude,longitude] (e.g. [50.123, -4.321])
  *
  * @example
  *     var p = destinationPoint(51.4778, -0.0015, 7794, 300.7); // 51.5135°N, 000.0983°W
  */

const destinationPoint = (lat, lon, distance, bearing) => {
  const radius = 6371e3; // (Mean) radius of earth

  const toRadians = v => v * Math.PI / 180;
  const toDegrees = v => v * 180 / Math.PI;

  // sinφ2 = sinφ1·cosδ + cosφ1·sinδ·cosθ
  // tanΔλ = sinθ·sinδ·cosφ1 / cosδ−sinφ1·sinφ2
  // see mathforum.org/library/drmath/view/52049.html for derivation

  const δ = Number(distance) / radius; // angular distance in radians
  const θ = toRadians(Number(bearing));

  const φ1 = toRadians(Number(lat));
  const λ1 = toRadians(Number(lon));

  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);

  const sinδ = Math.sin(δ);
  const cosδ = Math.cos(δ);

  const sinθ = Math.sin(θ);
  const cosθ = Math.cos(θ);

  const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * cosθ;
  const φ2 = Math.asin(sinφ2);
  const y = sinθ * sinδ * cosφ1;
  const x = cosδ - sinφ1 * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return [toDegrees(φ2), ((toDegrees(λ2) + 540) % 360) - 180]; // normalise to −180..+180°
};

import tinytime from 'tinytime'; // eslint-disable-line import/first

const timeTemplate = tinytime('{DD}/{Mo}/{YYYY} {H}:{mm}:{ss}', { padMonth: true });
const timeOffset = (date) => {
  const offset = date.getTimezoneOffset();
  return `${offset < 0 ? '+' : '-'}${`00${parseInt(Math.abs(offset / 60), 10)}`.slice(-2)}${`00${parseInt(Math.abs(offset % 60), 10)}`.slice(-2)}`;
};

const renderTime = date => `${timeTemplate.render(date)}${timeOffset(date)}`;

export {
  destinationPoint,
  renderTime,
};
