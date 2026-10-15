/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_History_To_PayInputs */

const en_declarations_history_to_pay = /** @type {(inputs: Declarations_History_To_PayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`to pay`)
};

const fr_declarations_history_to_pay = /** @type {(inputs: Declarations_History_To_PayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`à payer`)
};

/**
* | output |
* | --- |
* | "to pay" |
*
* @param {Declarations_History_To_PayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_history_to_pay = /** @type {((inputs?: Declarations_History_To_PayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_History_To_PayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_history_to_pay(inputs)
	return en_declarations_history_to_pay(inputs)
});