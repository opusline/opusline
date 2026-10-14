/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Payment_No_IbanInputs */

const en_editor_payment_no_iban = /** @type {(inputs: Editor_Payment_No_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add your IBAN in Settings to print it.`)
};

const fr_editor_payment_no_iban = /** @type {(inputs: Editor_Payment_No_IbanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajoutez votre IBAN dans Réglages pour l'imprimer.`)
};

/**
* | output |
* | --- |
* | "Add your IBAN in Settings to print it." |
*
* @param {Editor_Payment_No_IbanInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_payment_no_iban = /** @type {((inputs?: Editor_Payment_No_IbanInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Payment_No_IbanInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_payment_no_iban(inputs)
	return en_editor_payment_no_iban(inputs)
});