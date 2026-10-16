/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Delete_DraftInputs */

const en_quote_delete_draft = /** @type {(inputs: Quote_Delete_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the draft`)
};

const fr_quote_delete_draft = /** @type {(inputs: Quote_Delete_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer le brouillon`)
};

/**
* | output |
* | --- |
* | "Delete the draft" |
*
* @param {Quote_Delete_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_delete_draft = /** @type {((inputs?: Quote_Delete_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Delete_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_delete_draft(inputs)
	return en_quote_delete_draft(inputs)
});