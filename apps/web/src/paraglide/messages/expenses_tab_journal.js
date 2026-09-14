/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Tab_JournalInputs */

const en_expenses_tab_journal = /** @type {(inputs: Expenses_Tab_JournalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journal`)
};

const fr_expenses_tab_journal = /** @type {(inputs: Expenses_Tab_JournalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journal`)
};

/**
* | output |
* | --- |
* | "Journal" |
*
* @param {Expenses_Tab_JournalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_tab_journal = /** @type {((inputs?: Expenses_Tab_JournalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Tab_JournalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_tab_journal(inputs)
	return en_expenses_tab_journal(inputs)
});