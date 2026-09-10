/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Month_Field_Next_YearInputs */

const en_month_field_next_year = /** @type {(inputs: Month_Field_Next_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Next year`)
};

const fr_month_field_next_year = /** @type {(inputs: Month_Field_Next_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Année suivante`)
};

/**
* | output |
* | --- |
* | "Next year" |
*
* @param {Month_Field_Next_YearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const month_field_next_year = /** @type {((inputs?: Month_Field_Next_YearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Field_Next_YearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_month_field_next_year(inputs)
	return en_month_field_next_year(inputs)
});