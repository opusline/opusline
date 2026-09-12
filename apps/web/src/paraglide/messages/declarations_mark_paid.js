/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Mark_PaidInputs */

const en_declarations_mark_paid = /** @type {(inputs: Declarations_Mark_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as paid`)
};

const fr_declarations_mark_paid = /** @type {(inputs: Declarations_Mark_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer payée`)
};

/**
* | output |
* | --- |
* | "Mark as paid" |
*
* @param {Declarations_Mark_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_mark_paid = /** @type {((inputs?: Declarations_Mark_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Mark_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_mark_paid(inputs)
	return en_declarations_mark_paid(inputs)
});