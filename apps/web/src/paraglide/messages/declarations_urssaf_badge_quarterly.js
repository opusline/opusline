/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_Badge_QuarterlyInputs */

const en_declarations_urssaf_badge_quarterly = /** @type {(inputs: Declarations_Urssaf_Badge_QuarterlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`quarterly · collected`)
};

const fr_declarations_urssaf_badge_quarterly = /** @type {(inputs: Declarations_Urssaf_Badge_QuarterlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`trimestriel · encaissements`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_badge_quarterly(inputs)
	return en_declarations_urssaf_badge_quarterly(inputs)
});