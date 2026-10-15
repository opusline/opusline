/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_DateInputs */

const en_expenses_field_date = /** @type {(inputs: Expenses_Field_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

const fr_expenses_field_date = /** @type {(inputs: Expenses_Field_DateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Date`)
};

/**
* | output |
* | --- |
* | "Date" |
*
* @param {Expenses_Field_DateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_date = /** @type {((inputs?: Expenses_Field_DateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_DateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_date(inputs)
	return en_expenses_field_date(inputs)
});