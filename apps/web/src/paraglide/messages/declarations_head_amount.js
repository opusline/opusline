/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Head_AmountInputs */

const en_declarations_head_amount = /** @type {(inputs: Declarations_Head_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

const fr_declarations_head_amount = /** @type {(inputs: Declarations_Head_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant`)
};

/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Declarations_Head_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_head_amount = /** @type {((inputs?: Declarations_Head_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Head_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_head_amount(inputs)
	return en_declarations_head_amount(inputs)
});