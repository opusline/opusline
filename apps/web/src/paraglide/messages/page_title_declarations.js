/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_DeclarationsInputs */

const en_page_title_declarations = /** @type {(inputs: Page_Title_DeclarationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filings`)
};

const fr_page_title_declarations = /** @type {(inputs: Page_Title_DeclarationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclarations`)
};

/**
* | output |
* | --- |
* | "Filings" |
*
* @param {Page_Title_DeclarationsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_declarations = /** @type {((inputs?: Page_Title_DeclarationsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_DeclarationsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_declarations(inputs)
	return en_page_title_declarations(inputs)
});