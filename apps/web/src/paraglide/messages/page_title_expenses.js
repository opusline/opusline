/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_ExpensesInputs */

const en_page_title_expenses = /** @type {(inputs: Page_Title_ExpensesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expenses`)
};

const fr_page_title_expenses = /** @type {(inputs: Page_Title_ExpensesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépenses`)
};

/**
* | output |
* | --- |
* | "Expenses" |
*
* @param {Page_Title_ExpensesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_expenses = /** @type {((inputs?: Page_Title_ExpensesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_ExpensesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_expenses(inputs)
	return en_page_title_expenses(inputs)
});