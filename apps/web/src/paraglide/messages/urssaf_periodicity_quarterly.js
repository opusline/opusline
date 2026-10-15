/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Urssaf_Periodicity_QuarterlyInputs */



/**
* | output |
* | --- |
* | "Quarterly" |
*
* @param {Urssaf_Periodicity_QuarterlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const urssaf_periodicity_quarterly = /** @type {((inputs?: Urssaf_Periodicity_QuarterlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Urssaf_Periodicity_QuarterlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Trimestrielle")
	return /** @type {LocalizedString} */ ("Quarterly")
});