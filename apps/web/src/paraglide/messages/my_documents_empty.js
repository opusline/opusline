/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_EmptyInputs */

const en_my_documents_empty = /** @type {(inputs: My_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No piece filed yet.`)
};

const fr_my_documents_empty = /** @type {(inputs: My_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune pièce déposée pour le moment.`)
};

/**
* | output |
* | --- |
* | "No piece filed yet." |
*
* @param {My_Documents_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_empty = /** @type {((inputs?: My_Documents_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_empty(inputs)
	return en_my_documents_empty(inputs)
});