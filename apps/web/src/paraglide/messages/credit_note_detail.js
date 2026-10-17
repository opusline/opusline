/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_DetailInputs */

const en_credit_note_detail = /** @type {(inputs: Credit_Note_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detail · optional, printed on the credit note`)
};

const fr_credit_note_detail = /** @type {(inputs: Credit_Note_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Précision · facultatif, reprise sur l'avoir`)
};

/**
* | output |
* | --- |
* | "Detail · optional, printed on the credit note" |
*
* @param {Credit_Note_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_detail = /** @type {((inputs?: Credit_Note_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_detail(inputs)
	return en_credit_note_detail(inputs)
});