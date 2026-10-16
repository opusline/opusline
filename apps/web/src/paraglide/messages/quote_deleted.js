/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_DeletedInputs */

const en_quote_deleted = /** @type {(inputs: Quote_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft deleted`)
};

const fr_quote_deleted = /** @type {(inputs: Quote_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon supprimé`)
};

/**
* | output |
* | --- |
* | "Draft deleted" |
*
* @param {Quote_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_deleted = /** @type {((inputs?: Quote_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_deleted(inputs)
	return en_quote_deleted(inputs)
});