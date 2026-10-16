/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, client: NonNullable<unknown> }} Quote_Delete_BodyInputs */

const en_quote_delete_body = /** @type {(inputs: Quote_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The ${i?.amount} draft for ${i?.client} will be removed.`)
};

const fr_quote_delete_body = /** @type {(inputs: Quote_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le brouillon de ${i?.amount} pour ${i?.client} sera supprimé.`)
};

/**
* | output |
* | --- |
* | "The {amount} draft for {client} will be removed." |
*
* @param {Quote_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_delete_body = /** @type {((inputs: Quote_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_delete_body(inputs)
	return en_quote_delete_body(inputs)
});