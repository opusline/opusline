/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Sheet_Edit_TitleInputs */

const en_expenses_sheet_edit_title = /** @type {(inputs: Expenses_Sheet_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the expense`)
};

const fr_expenses_sheet_edit_title = /** @type {(inputs: Expenses_Sheet_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier la dépense`)
};

/**
* | output |
* | --- |
* | "Edit the expense" |
*
* @param {Expenses_Sheet_Edit_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_sheet_edit_title = /** @type {((inputs?: Expenses_Sheet_Edit_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Sheet_Edit_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_sheet_edit_title(inputs)
	return en_expenses_sheet_edit_title(inputs)
});