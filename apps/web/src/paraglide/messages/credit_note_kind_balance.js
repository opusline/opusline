/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_BalanceInputs */

const en_credit_note_kind_balance = /** @type {(inputs: Credit_Note_Kind_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Balance credit note`)
};

const fr_credit_note_kind_balance = /** @type {(inputs: Credit_Note_Kind_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir du solde`)
};

/**
* | output |
* | --- |
* | "Balance credit note" |
*
* @param {Credit_Note_Kind_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_balance = /** @type {((inputs?: Credit_Note_Kind_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_balance(inputs)
	return en_credit_note_kind_balance(inputs)
});