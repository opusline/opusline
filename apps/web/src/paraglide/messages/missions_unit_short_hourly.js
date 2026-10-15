/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unit_Short_HourlyInputs */

const en_missions_unit_short_hourly = /** @type {(inputs: Missions_Unit_Short_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / h`)
};

const fr_missions_unit_short_hourly = /** @type {(inputs: Missions_Unit_Short_HourlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` / h`)
};

/**
* | output |
* | --- |
* | "/ h" |
*
* @param {Missions_Unit_Short_HourlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unit_short_hourly = /** @type {((inputs?: Missions_Unit_Short_HourlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unit_Short_HourlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unit_short_hourly(inputs)
	return en_missions_unit_short_hourly(inputs)
});