/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Send_Heading_QuoteInputs */

const en_send_heading_quote = /** @type {(inputs: Send_Heading_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Send quote ${i?.number}`)
};

const fr_send_heading_quote = /** @type {(inputs: Send_Heading_QuoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoyer le devis ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Send quote {number}" |
*
* @param {Send_Heading_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_heading_quote = /** @type {((inputs: Send_Heading_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Heading_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_heading_quote(inputs)
	return en_send_heading_quote(inputs)
});