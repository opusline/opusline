/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_PaidInputs */

const en_declarations_history_paid = /** @type {(inputs: Declarations_History_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paid`)
};

const fr_declarations_history_paid = /** @type {(inputs: Declarations_History_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payée`)
};

/**
* | output |
* | --- |
* | "Paid" |
*
* @param {Declarations_History_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_paid = /** @type {((inputs?: Declarations_History_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_paid(inputs)
	return en_declarations_history_paid(inputs)
});