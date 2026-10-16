/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_TitleInputs */

const en_external_quote_title = /** @type {(inputs: External_Quote_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a quote issued elsewhere`)
};

const fr_external_quote_title = /** @type {(inputs: External_Quote_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un devis émis ailleurs`)
};

/**
* | output |
* | --- |
* | "Add a quote issued elsewhere" |
*
* @param {External_Quote_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_title = /** @type {((inputs?: External_Quote_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_title(inputs)
	return en_external_quote_title(inputs)
});