/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Take_LineInputs */

const en_credit_note_take_line = /** @type {(inputs: Credit_Note_Take_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Take back a line of the invoice`)
};

const fr_credit_note_take_line = /** @type {(inputs: Credit_Note_Take_LineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre une ligne de la facture`)
};

/**
* | output |
* | --- |
* | "Take back a line of the invoice" |
*
* @param {Credit_Note_Take_LineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_take_line = /** @type {((inputs?: Credit_Note_Take_LineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Take_LineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_take_line(inputs)
	return en_credit_note_take_line(inputs)
});