/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Bank_Account_Edit_AriaInputs */

const en_bank_account_edit_aria = /** @type {(inputs: Bank_Account_Edit_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rename or close ${i?.name}`)
};

const fr_bank_account_edit_aria = /** @type {(inputs: Bank_Account_Edit_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Renommer ou clôturer ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Rename or close {name}" |
*
* @param {Bank_Account_Edit_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_account_edit_aria = /** @type {((inputs: Bank_Account_Edit_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Account_Edit_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_account_edit_aria(inputs)
	return en_bank_account_edit_aria(inputs)
});