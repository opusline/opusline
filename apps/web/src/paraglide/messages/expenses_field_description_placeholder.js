/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_Description_PlaceholderInputs */

const en_expenses_field_description_placeholder = /** @type {(inputs: Expenses_Field_Description_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`27-inch monitor`)
};

const fr_expenses_field_description_placeholder = /** @type {(inputs: Expenses_Field_Description_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Écran 27 pouces`)
};

/**
* | output |
* | --- |
* | "27-inch monitor" |
*
* @param {Expenses_Field_Description_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_description_placeholder = /** @type {((inputs?: Expenses_Field_Description_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_Description_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_description_placeholder(inputs)
	return en_expenses_field_description_placeholder(inputs)
});