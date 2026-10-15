/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_Badge_QuarterlyInputs */



/**
* | output |
* | --- |
* | "quarterly · collected" |
*
* @param {Declarations_Urssaf_Badge_QuarterlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_badge_quarterly = /** @type {((inputs?: Declarations_Urssaf_Badge_QuarterlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_Badge_QuarterlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("trimestriel · encaissements")
	return /** @type {LocalizedString} */ ("quarterly · collected")
});