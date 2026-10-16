/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Draft_TextInputs */

const en_quote_draft_text = /** @type {(inputs: Quote_Draft_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No number yet: it is assigned on validation, from the quotes' own series. The client receives nothing until the quote is validated.`)
};

const fr_quote_draft_text = /** @type {(inputs: Quote_Draft_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore de numéro : il est attribué à la validation, dans la série propre aux devis. Le client ne reçoit rien tant que le devis n'est pas validé.`)
};

/**
* | output |
* | --- |
* | "No number yet: it is assigned on validation, from the quotes' own series. The client receives nothing until the quote is validated." |
*
* @param {Quote_Draft_TextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_draft_text = /** @type {((inputs?: Quote_Draft_TextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Draft_TextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_draft_text(inputs)
	return en_quote_draft_text(inputs)
});