/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Date_Field_Hint_DmyInputs */

const en_date_field_hint_dmy = /** @type {(inputs: Date_Field_Hint_DmyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`DD/MM/YYYY`)
};

const fr_date_field_hint_dmy = /** @type {(inputs: Date_Field_Hint_DmyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`JJ/MM/AAAA`)
};

/**
* | output |
* | --- |
* | "DD/MM/YYYY" |
*
* @param {Date_Field_Hint_DmyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const date_field_hint_dmy = /** @type {((inputs?: Date_Field_Hint_DmyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Date_Field_Hint_DmyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_date_field_hint_dmy(inputs)
	return en_date_field_hint_dmy(inputs)
});