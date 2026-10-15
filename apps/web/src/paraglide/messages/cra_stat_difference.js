/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Stat_DifferenceInputs */

const en_cra_stat_difference = /** @type {(inputs: Cra_Stat_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drift from tracking`)
};

const fr_cra_stat_difference = /** @type {(inputs: Cra_Stat_DifferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Écarts avec le suivi`)
};

/**
* | output |
* | --- |
* | "Drift from tracking" |
*
* @param {Cra_Stat_DifferenceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_stat_difference = /** @type {((inputs?: Cra_Stat_DifferenceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Stat_DifferenceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_stat_difference(inputs)
	return en_cra_stat_difference(inputs)
});