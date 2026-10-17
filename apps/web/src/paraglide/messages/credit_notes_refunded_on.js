/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Notes_Refunded_OnInputs */

const en_credit_notes_refunded_on = /** @type {(inputs: Credit_Notes_Refunded_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refunded on`)
};

const fr_credit_notes_refunded_on = /** @type {(inputs: Credit_Notes_Refunded_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remboursé le`)
};

/**
* | output |
* | --- |
* | "Refunded on" |
*
* @param {Credit_Notes_Refunded_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_notes_refunded_on = /** @type {((inputs?: Credit_Notes_Refunded_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Notes_Refunded_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_notes_refunded_on(inputs)
	return en_credit_notes_refunded_on(inputs)
});