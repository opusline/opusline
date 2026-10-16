/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Title_PlaceholderInputs */

const en_external_quote_title_placeholder = /** @type {(inputs: External_Quote_Title_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back-office overhaul`)
};

const fr_external_quote_title_placeholder = /** @type {(inputs: External_Quote_Title_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refonte du back-office`)
};

/**
* | output |
* | --- |
* | "Back-office overhaul" |
*
* @param {External_Quote_Title_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_title_placeholder = /** @type {((inputs?: External_Quote_Title_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Title_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_title_placeholder(inputs)
	return en_external_quote_title_placeholder(inputs)
});