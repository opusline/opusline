/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Date_Field_ClearInputs */

const en_date_field_clear = /** @type {(inputs: Date_Field_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear the date`)
};

const fr_date_field_clear = /** @type {(inputs: Date_Field_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effacer la date`)
};

/**
* | output |
* | --- |
* | "Clear the date" |
*
* @param {Date_Field_ClearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const date_field_clear = /** @type {((inputs?: Date_Field_ClearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Field_ClearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_date_field_clear(inputs)
	return en_date_field_clear(inputs)
});