/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rate_MissingInputs */

const en_missions_rate_missing = /** @type {(inputs: Missions_Rate_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The rate is missing or invalid.`)
};

const fr_missions_rate_missing = /** @type {(inputs: Missions_Rate_MissingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le tarif est manquant ou invalide.`)
};

/**
* | output |
* | --- |
* | "The rate is missing or invalid." |
*
* @param {Missions_Rate_MissingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rate_missing = /** @type {((inputs?: Missions_Rate_MissingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rate_MissingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rate_missing(inputs)
	return en_missions_rate_missing(inputs)
});