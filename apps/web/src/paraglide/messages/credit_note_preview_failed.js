/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Preview_FailedInputs */

const en_credit_note_preview_failed = /** @type {(inputs: Credit_Note_Preview_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The credit note cannot be printed as it stands.`)
};

const fr_credit_note_preview_failed = /** @type {(inputs: Credit_Note_Preview_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'avoir ne peut pas être imprimé en l'état.`)
};

/**
* | output |
* | --- |
* | "The credit note cannot be printed as it stands." |
*
* @param {Credit_Note_Preview_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_preview_failed = /** @type {((inputs?: Credit_Note_Preview_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Preview_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_preview_failed(inputs)
	return en_credit_note_preview_failed(inputs)
});