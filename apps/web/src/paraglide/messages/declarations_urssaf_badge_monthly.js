/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_Badge_MonthlyInputs */

const en_declarations_urssaf_badge_monthly = /** @type {(inputs: Declarations_Urssaf_Badge_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`monthly · collected`)
};

const fr_declarations_urssaf_badge_monthly = /** @type {(inputs: Declarations_Urssaf_Badge_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`mensuel · encaissements`)
};

/**
* | output |
* | --- |
* | "monthly · collected" |
*
* @param {Declarations_Urssaf_Badge_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_badge_monthly = /** @type {((inputs?: Declarations_Urssaf_Badge_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_Badge_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_badge_monthly(inputs)
	return en_declarations_urssaf_badge_monthly(inputs)
});