/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unit_HourlyInputs */

const en_missions_unit_hourly = /** @type {(inputs: Missions_Unit_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / hour`)
};

const fr_missions_unit_hourly = /** @type {(inputs: Missions_Unit_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / heure`)
};

/**
* | output |
* | --- |
* | "/ hour" |
*
* @param {Missions_Unit_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unit_hourly = /** @type {((inputs?: Missions_Unit_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unit_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unit_hourly(inputs)
	return en_missions_unit_hourly(inputs)
});