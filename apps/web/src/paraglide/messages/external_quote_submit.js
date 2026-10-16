/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_SubmitInputs */

const en_external_quote_submit = /** @type {(inputs: External_Quote_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add the quote`)
};

const fr_external_quote_submit = /** @type {(inputs: External_Quote_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter le devis`)
};

/**
* | output |
* | --- |
* | "Add the quote" |
*
* @param {External_Quote_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_submit = /** @type {((inputs?: External_Quote_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_submit(inputs)
	return en_external_quote_submit(inputs)
});