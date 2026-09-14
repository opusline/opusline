/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_Amount_TtcInputs */

const en_expenses_field_amount_ttc = /** @type {(inputs: Expenses_Field_Amount_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount TTC`)
};

const fr_expenses_field_amount_ttc = /** @type {(inputs: Expenses_Field_Amount_TtcInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant TTC`)
};

/**
* | output |
* | --- |
* | "Amount TTC" |
*
* @param {Expenses_Field_Amount_TtcInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_amount_ttc = /** @type {((inputs?: Expenses_Field_Amount_TtcInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_Amount_TtcInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_amount_ttc(inputs)
	return en_expenses_field_amount_ttc(inputs)
});