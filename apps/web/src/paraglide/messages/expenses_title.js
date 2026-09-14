/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_TitleInputs */

const en_expenses_title = /** @type {(inputs: Expenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expenses`)
};

const fr_expenses_title = /** @type {(inputs: Expenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépenses`)
};

/**
* | output |
* | --- |
* | "Expenses" |
*
* @param {Expenses_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_title = /** @type {((inputs?: Expenses_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_title(inputs)
	return en_expenses_title(inputs)
});