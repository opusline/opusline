/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_Field_LabelInputs */

const en_bank_balance_field_label = /** @type {(inputs: Bank_Balance_Field_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Balance`)
};

const fr_bank_balance_field_label = /** @type {(inputs: Bank_Balance_Field_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde`)
};

/**
* | output |
* | --- |
* | "Balance" |
*
* @param {Bank_Balance_Field_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_field_label = /** @type {((inputs?: Bank_Balance_Field_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Field_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_field_label(inputs)
	return en_bank_balance_field_label(inputs)
});