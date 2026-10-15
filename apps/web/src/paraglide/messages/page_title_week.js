/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_WeekInputs */

const en_page_title_week = /** @type {(inputs: Page_Title_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Time tracking`)
};

const fr_page_title_week = /** @type {(inputs: Page_Title_WeekInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi du temps`)
};

/**
* | output |
* | --- |
* | "Time tracking" |
*
* @param {Page_Title_WeekInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_week = /** @type {((inputs?: Page_Title_WeekInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_WeekInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_week(inputs)
	return en_page_title_week(inputs)
});