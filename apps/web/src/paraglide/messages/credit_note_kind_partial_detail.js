/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_Partial_DetailInputs */

const en_credit_note_kind_partial_detail = /** @type {(inputs: Credit_Note_Kind_Partial_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corrects a part: a discount, a line too many, a wrong price. The invoice stays valid.`)
};

const fr_credit_note_kind_partial_detail = /** @type {(inputs: Credit_Note_Kind_Partial_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corrige une partie : remise, ligne en trop, prix erroné. La facture reste valable.`)
};

/**
* | output |
* | --- |
* | "Corrects a part: a discount, a line too many, a wrong price. The invoice stays valid." |
*
* @param {Credit_Note_Kind_Partial_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_partial_detail = /** @type {((inputs?: Credit_Note_Kind_Partial_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_Partial_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_partial_detail(inputs)
	return en_credit_note_kind_partial_detail(inputs)
});