/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_History_CreditInputs */

const en_declarations_history_credit = /** @type {(inputs: Declarations_History_CreditInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`credit ${i?.amount}`)
};

const fr_declarations_history_credit = /** @type {(inputs: Declarations_History_CreditInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`crédit ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "credit {amount}" |
*
* @param {Declarations_History_CreditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_credit = /** @type {((inputs: Declarations_History_CreditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_CreditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_credit(inputs)
	return en_declarations_history_credit(inputs)
});