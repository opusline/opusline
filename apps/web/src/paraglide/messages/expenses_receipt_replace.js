/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_ReplaceInputs */

const en_expenses_receipt_replace = /** @type {(inputs: Expenses_Receipt_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Replace`)
};

const fr_expenses_receipt_replace = /** @type {(inputs: Expenses_Receipt_ReplaceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplacer`)
};

/**
* | output |
* | --- |
* | "Replace" |
*
* @param {Expenses_Receipt_ReplaceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_replace = /** @type {((inputs?: Expenses_Receipt_ReplaceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_ReplaceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_replace(inputs)
	return en_expenses_receipt_replace(inputs)
});