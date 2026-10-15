/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Page_TitleInputs */

const en_week_page_title = /** @type {(inputs: Week_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Week`)
};

const fr_week_page_title = /** @type {(inputs: Week_Page_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Semaine`)
};

/**
* | output |
* | --- |
* | "Week" |
*
* @param {Week_Page_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_page_title = /** @type {((inputs?: Week_Page_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Page_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_page_title(inputs)
	return en_week_page_title(inputs)
});