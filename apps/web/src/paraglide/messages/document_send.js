/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Document_SendInputs */

const en_document_send = /** @type {(inputs: Document_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send by e-mail`)
};

const fr_document_send = /** @type {(inputs: Document_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyer par e-mail`)
};

/**
* | output |
* | --- |
* | "Send by e-mail" |
*
* @param {Document_SendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const document_send = /** @type {((inputs?: Document_SendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Document_SendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_document_send(inputs)
	return en_document_send(inputs)
});