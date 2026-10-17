/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Reason_OtherInputs */

const en_credit_note_reason_other = /** @type {(inputs: Credit_Note_Reason_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other`)
};

const fr_credit_note_reason_other = /** @type {(inputs: Credit_Note_Reason_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autre`)
};

/**
* | output |
* | --- |
* | "Other" |
*
* @param {Credit_Note_Reason_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_reason_other = /** @type {((inputs?: Credit_Note_Reason_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Reason_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_reason_other(inputs)
	return en_credit_note_reason_other(inputs)
});