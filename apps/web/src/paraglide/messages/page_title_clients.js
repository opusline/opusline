/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_ClientsInputs */

const en_page_title_clients = /** @type {(inputs: Page_Title_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client portfolio`)
};

const fr_page_title_clients = /** @type {(inputs: Page_Title_ClientsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Portefeuille clients`)
};

/**
* | output |
* | --- |
* | "Client portfolio" |
*
* @param {Page_Title_ClientsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_clients = /** @type {((inputs?: Page_Title_ClientsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_ClientsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_clients(inputs)
	return en_page_title_clients(inputs)
});