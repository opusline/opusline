/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Amount_InvalidInputs */

const en_expenses_amount_invalid = /** @type {(inputs: Expenses_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an amount.`)
};

const fr_expenses_amount_invalid = /** @type {(inputs: Expenses_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un montant.`)
};

/**
* | output |
* | --- |
* | "Enter an amount." |
*
* @param {Expenses_Amount_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_amount_invalid = /** @type {((inputs?: Expenses_Amount_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Amount_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_amount_invalid(inputs)
	return en_expenses_amount_invalid(inputs)
});