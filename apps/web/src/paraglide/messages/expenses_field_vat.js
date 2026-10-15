/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_VatInputs */

const en_expenses_field_vat = /** @type {(inputs: Expenses_Field_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA rate`)
};

const fr_expenses_field_vat = /** @type {(inputs: Expenses_Field_VatInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux de TVA`)
};

/**
* | output |
* | --- |
* | "TVA rate" |
*
* @param {Expenses_Field_VatInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_vat = /** @type {((inputs?: Expenses_Field_VatInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_VatInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_vat(inputs)
	return en_expenses_field_vat(inputs)
});