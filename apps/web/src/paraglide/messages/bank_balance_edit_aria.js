/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_Edit_AriaInputs */

const en_bank_balance_edit_aria = /** @type {(inputs: Bank_Balance_Edit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the balance`)
};

const fr_bank_balance_edit_aria = /** @type {(inputs: Bank_Balance_Edit_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier le solde`)
};

/**
* | output |
* | --- |
* | "Edit the balance" |
*
* @param {Bank_Balance_Edit_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_edit_aria = /** @type {((inputs?: Bank_Balance_Edit_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Edit_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_edit_aria(inputs)
	return en_bank_balance_edit_aria(inputs)
});