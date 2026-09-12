/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Pro_Share_InvalidInputs */

const en_expenses_pro_share_invalid = /** @type {(inputs: Expenses_Pro_Share_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a share between 0 and 100.`)
};

const fr_expenses_pro_share_invalid = /** @type {(inputs: Expenses_Pro_Share_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez une part entre 0 et 100.`)
};

/**
* | output |
* | --- |
* | "Enter a share between 0 and 100." |
*
* @param {Expenses_Pro_Share_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_pro_share_invalid = /** @type {((inputs?: Expenses_Pro_Share_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Pro_Share_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_pro_share_invalid(inputs)
	return en_expenses_pro_share_invalid(inputs)
});