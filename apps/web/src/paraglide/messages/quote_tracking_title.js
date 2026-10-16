/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_TitleInputs */

const en_quote_tracking_title = /** @type {(inputs: Quote_Tracking_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote tracking`)
};

const fr_quote_tracking_title = /** @type {(inputs: Quote_Tracking_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi du devis`)
};

/**
* | output |
* | --- |
* | "Quote tracking" |
*
* @param {Quote_Tracking_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_title = /** @type {((inputs?: Quote_Tracking_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_title(inputs)
	return en_quote_tracking_title(inputs)
});