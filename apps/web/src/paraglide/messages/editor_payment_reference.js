/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Payment_ReferenceInputs */

const en_editor_payment_reference = /** @type {(inputs: Editor_Payment_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice number is the transfer reference: Opusline matches the payment automatically.`)
};

const fr_editor_payment_reference = /** @type {(inputs: Editor_Payment_ReferenceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le numéro de facture sert de référence de virement : Opusline rapproche l'encaissement automatiquement.`)
};

/**
* | output |
* | --- |
* | "The invoice number is the transfer reference: Opusline matches the payment automatically." |
*
* @param {Editor_Payment_ReferenceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_payment_reference = /** @type {((inputs?: Editor_Payment_ReferenceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Payment_ReferenceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_payment_reference(inputs)
	return en_editor_payment_reference(inputs)
});