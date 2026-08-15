/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rate_HtInputs */

const en_missions_rate_ht = /** @type {(inputs: Missions_Rate_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rate HT`)
};

const fr_missions_rate_ht = /** @type {(inputs: Missions_Rate_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tarif HT`)
};

/**
* | output |
* | --- |
* | "Rate HT" |
*
* @param {Missions_Rate_HtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rate_ht = /** @type {((inputs?: Missions_Rate_HtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rate_HtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rate_ht(inputs)
	return en_missions_rate_ht(inputs)
});