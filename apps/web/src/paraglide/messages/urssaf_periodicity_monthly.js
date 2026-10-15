/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Urssaf_Periodicity_MonthlyInputs */



/**
* | output |
* | --- |
* | "Monthly" |
*
* @param {Urssaf_Periodicity_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const urssaf_periodicity_monthly = /** @type {((inputs?: Urssaf_Periodicity_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Urssaf_Periodicity_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Mensuelle")
	return /** @type {LocalizedString} */ ("Monthly")
});