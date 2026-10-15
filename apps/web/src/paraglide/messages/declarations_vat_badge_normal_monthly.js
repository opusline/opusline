/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Vat_Badge_Normal_MonthlyInputs */

const en_declarations_vat_badge_normal_monthly = /** @type {(inputs: Declarations_Vat_Badge_Normal_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`réel normal · monthly`)
};

const fr_declarations_vat_badge_normal_monthly = /** @type {(inputs: Declarations_Vat_Badge_Normal_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`réel normal · mensuel`)
};

/**
* | output |
* | --- |
* | "réel normal · monthly" |
*
* @param {Declarations_Vat_Badge_Normal_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_badge_normal_monthly = /** @type {((inputs?: Declarations_Vat_Badge_Normal_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_Badge_Normal_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_badge_normal_monthly(inputs)
	return en_declarations_vat_badge_normal_monthly(inputs)
});