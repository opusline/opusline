/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Date_Field_Hint_IsoInputs */

const en_date_field_hint_iso = /** @type {(inputs: Date_Field_Hint_IsoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`YYYY-MM-DD`)
};

const fr_date_field_hint_iso = /** @type {(inputs: Date_Field_Hint_IsoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AAAA-MM-JJ`)
};

/**
* | output |
* | --- |
* | "YYYY-MM-DD" |
*
* @param {Date_Field_Hint_IsoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const date_field_hint_iso = /** @type {((inputs?: Date_Field_Hint_IsoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Field_Hint_IsoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_date_field_hint_iso(inputs)
	return en_date_field_hint_iso(inputs)
});