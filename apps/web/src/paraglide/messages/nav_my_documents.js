/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_My_DocumentsInputs */

const en_nav_my_documents = /** @type {(inputs: Nav_My_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My documents`)
};

const fr_nav_my_documents = /** @type {(inputs: Nav_My_DocumentsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mes documents`)
};

/**
* | output |
* | --- |
* | "My documents" |
*
* @param {Nav_My_DocumentsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_my_documents = /** @type {((inputs?: Nav_My_DocumentsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_My_DocumentsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_my_documents(inputs)
	return en_nav_my_documents(inputs)
});