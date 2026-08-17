/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} My_Documents_Complete_BodyInputs */

const en_my_documents_complete_body = /** @type {(inputs: My_Documents_Complete_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`All four pieces a client usually asks for are filed.`)
};

const fr_my_documents_complete_body = /** @type {(inputs: My_Documents_Complete_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les quatre pièces habituellement réclamées sont déposées.`)
};

/**
* | output |
* | --- |
* | "All four pieces a client usually asks for are filed." |
*
* @param {My_Documents_Complete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const my_documents_complete_body = /** @type {((inputs?: My_Documents_Complete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<My_Documents_Complete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_my_documents_complete_body(inputs)
	return en_my_documents_complete_body(inputs)
});