/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Detail_HintInputs */

const en_credit_note_detail_hint = /** @type {(inputs: Credit_Note_Detail_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Under the reason, on the credit note the client receives.`)
};

const fr_credit_note_detail_hint = /** @type {(inputs: Credit_Note_Detail_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sous le motif, sur l'avoir que reçoit le client.`)
};

/**
* | output |
* | --- |
* | "Under the reason, on the credit note the client receives." |
*
* @param {Credit_Note_Detail_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_detail_hint = /** @type {((inputs?: Credit_Note_Detail_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Detail_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_detail_hint(inputs)
	return en_credit_note_detail_hint(inputs)
});