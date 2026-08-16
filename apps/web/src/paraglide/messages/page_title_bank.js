/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_BankInputs */

const en_page_title_bank = /** @type {(inputs: Page_Title_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account`)
};

const fr_page_title_bank = /** @type {(inputs: Page_Title_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte pro`)
};

/**
* | output |
* | --- |
* | "Business account" |
*
* @param {Page_Title_BankInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_bank = /** @type {((inputs?: Page_Title_BankInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_BankInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_bank(inputs)
	return en_page_title_bank(inputs)
});