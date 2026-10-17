/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_BackInputs */

const en_credit_note_back = /** @type {(inputs: Credit_Note_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to the invoice`)
};

const fr_credit_note_back = /** @type {(inputs: Credit_Note_BackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retour à la facture`)
};

/**
* | output |
* | --- |
* | "Back to the invoice" |
*
* @param {Credit_Note_BackInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_back = /** @type {((inputs?: Credit_Note_BackInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_BackInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_back(inputs)
	return en_credit_note_back(inputs)
});