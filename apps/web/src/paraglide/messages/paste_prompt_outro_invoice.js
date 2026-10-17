/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Paste_Prompt_Outro_InvoiceInputs */

const en_paste_prompt_outro_invoice = /** @type {(inputs: Paste_Prompt_Outro_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Here is what I want to invoice:`)
};

const fr_paste_prompt_outro_invoice = /** @type {(inputs: Paste_Prompt_Outro_InvoiceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voici ce que je veux facturer :`)
};

/**
* | output |
* | --- |
* | "Here is what I want to invoice:" |
*
* @param {Paste_Prompt_Outro_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_prompt_outro_invoice = /** @type {((inputs?: Paste_Prompt_Outro_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Prompt_Outro_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_prompt_outro_invoice(inputs)
	return en_paste_prompt_outro_invoice(inputs)
});