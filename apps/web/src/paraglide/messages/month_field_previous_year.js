/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Month_Field_Previous_YearInputs */

const en_month_field_previous_year = /** @type {(inputs: Month_Field_Previous_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Previous year`)
};

const fr_month_field_previous_year = /** @type {(inputs: Month_Field_Previous_YearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Année précédente`)
};

/**
* | output |
* | --- |
* | "Previous year" |
*
* @param {Month_Field_Previous_YearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const month_field_previous_year = /** @type {((inputs?: Month_Field_Previous_YearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Month_Field_Previous_YearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_month_field_previous_year(inputs)
	return en_month_field_previous_year(inputs)
});