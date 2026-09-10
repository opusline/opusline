/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Month_Field_PlaceholderInputs */

const en_month_field_placeholder = /** @type {(inputs: Month_Field_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick a month`)
};

const fr_month_field_placeholder = /** @type {(inputs: Month_Field_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisir un mois`)
};

/**
* | output |
* | --- |
* | "Pick a month" |
*
* @param {Month_Field_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const month_field_placeholder = /** @type {((inputs?: Month_Field_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Field_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_month_field_placeholder(inputs)
	return en_month_field_placeholder(inputs)
});