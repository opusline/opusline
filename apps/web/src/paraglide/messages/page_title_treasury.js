/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_TreasuryInputs */

const en_page_title_treasury = /** @type {(inputs: Page_Title_TreasuryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Treasury`)
};

const fr_page_title_treasury = /** @type {(inputs: Page_Title_TreasuryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trésorerie`)
};

/**
* | output |
* | --- |
* | "Treasury" |
*
* @param {Page_Title_TreasuryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_treasury = /** @type {((inputs?: Page_Title_TreasuryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_TreasuryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_treasury(inputs)
	return en_page_title_treasury(inputs)
});