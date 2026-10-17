/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_ReissueInputs */

const en_credit_note_reissue = /** @type {(inputs: Credit_Note_ReissueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issue a corrected invoice afterwards`)
};

const fr_credit_note_reissue = /** @type {(inputs: Credit_Note_ReissueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Émettre ensuite une facture corrigée`)
};

/**
* | output |
* | --- |
* | "Issue a corrected invoice afterwards" |
*
* @param {Credit_Note_ReissueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_reissue = /** @type {((inputs?: Credit_Note_ReissueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_ReissueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_reissue(inputs)
	return en_credit_note_reissue(inputs)
});