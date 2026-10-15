/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Sheet_Edit_HintInputs */



/**
* | output |
* | --- |
* | "Change what is needed, then save." |
*
* @param {Expenses_Sheet_Edit_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_sheet_edit_hint = /** @type {((inputs?: Expenses_Sheet_Edit_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Sheet_Edit_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Modifiez ce qui doit l'être, puis enregistrez.")
	return /** @type {LocalizedString} */ ("Change what is needed, then save.")
});