/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Sheet_Create_HintInputs */

const en_expenses_sheet_create_hint = /** @type {(inputs: Expenses_Sheet_Create_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the receipt, or type it all in one line.`)
};

const fr_expenses_sheet_create_hint = /** @type {(inputs: Expenses_Sheet_Create_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lisez la facture, ou tapez tout d'une traite.`)
};

/**
* | output |
* | --- |
* | "Read the receipt, or type it all in one line." |
*
* @param {Expenses_Sheet_Create_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_sheet_create_hint = /** @type {((inputs?: Expenses_Sheet_Create_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Sheet_Create_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_sheet_create_hint(inputs)
	return en_expenses_sheet_create_hint(inputs)
});