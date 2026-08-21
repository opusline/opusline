/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_DocumentsInputs */

const en_nav_documents = /** @type {(inputs: Nav_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

const fr_nav_documents = /** @type {(inputs: Nav_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Documents`)
};

/**
* | output |
* | --- |
* | "Documents" |
*
* @param {Nav_DocumentsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_documents = /** @type {((inputs?: Nav_DocumentsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_DocumentsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_documents(inputs)
	return en_nav_documents(inputs)
});