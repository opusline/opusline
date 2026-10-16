/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Show_IbanInputs */

const en_editor_show_iban = /** @type {(inputs: Editor_Show_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show the IBAN and BIC on the invoice`)
};

const fr_editor_show_iban = /** @type {(inputs: Editor_Show_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afficher l'IBAN et le BIC sur la facture`)
};

/**
* | output |
* | --- |
* | "Show the IBAN and BIC on the invoice" |
*
* @param {Editor_Show_IbanInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_show_iban = /** @type {((inputs?: Editor_Show_IbanInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Show_IbanInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_show_iban(inputs)
	return en_editor_show_iban(inputs)
});