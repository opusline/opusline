/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_Pro_ShareInputs */

const en_expenses_field_pro_share = /** @type {(inputs: Expenses_Field_Pro_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business share`)
};

const fr_expenses_field_pro_share = /** @type {(inputs: Expenses_Field_Pro_ShareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote-part pro`)
};

/**
* | output |
* | --- |
* | "Business share" |
*
* @param {Expenses_Field_Pro_ShareInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_pro_share = /** @type {((inputs?: Expenses_Field_Pro_ShareInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_Pro_ShareInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_pro_share(inputs)
	return en_expenses_field_pro_share(inputs)
});