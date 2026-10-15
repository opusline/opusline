/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_RevenueInputs */

const en_page_title_revenue = /** @type {(inputs: Page_Title_RevenueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue`)
};

const fr_page_title_revenue = /** @type {(inputs: Page_Title_RevenueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenus`)
};

/**
* | output |
* | --- |
* | "Revenue" |
*
* @param {Page_Title_RevenueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_revenue = /** @type {((inputs?: Page_Title_RevenueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_RevenueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_revenue(inputs)
	return en_page_title_revenue(inputs)
});