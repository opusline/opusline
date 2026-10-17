/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_PartialInputs */

const en_credit_note_kind_partial = /** @type {(inputs: Credit_Note_Kind_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Partial credit note`)
};

const fr_credit_note_kind_partial = /** @type {(inputs: Credit_Note_Kind_PartialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avoir partiel`)
};

/**
* | output |
* | --- |
* | "Partial credit note" |
*
* @param {Credit_Note_Kind_PartialInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_partial = /** @type {((inputs?: Credit_Note_Kind_PartialInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_PartialInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_partial(inputs)
	return en_credit_note_kind_partial(inputs)
});