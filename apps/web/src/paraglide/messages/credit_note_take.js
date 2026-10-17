/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_TakeInputs */

const en_credit_note_take = /** @type {(inputs: Credit_Note_TakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Take back`)
};

const fr_credit_note_take = /** @type {(inputs: Credit_Note_TakeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprendre`)
};

/**
* | output |
* | --- |
* | "Take back" |
*
* @param {Credit_Note_TakeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_take = /** @type {((inputs?: Credit_Note_TakeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_TakeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_take(inputs)
	return en_credit_note_take(inputs)
});