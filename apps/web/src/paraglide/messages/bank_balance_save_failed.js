/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_Save_FailedInputs */

const en_bank_balance_save_failed = /** @type {(inputs: Bank_Balance_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The balance could not be saved.`)
};

const fr_bank_balance_save_failed = /** @type {(inputs: Bank_Balance_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le solde n'a pas pu être enregistré.`)
};

/**
* | output |
* | --- |
* | "The balance could not be saved." |
*
* @param {Bank_Balance_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_save_failed = /** @type {((inputs?: Bank_Balance_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_save_failed(inputs)
	return en_bank_balance_save_failed(inputs)
});