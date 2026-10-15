/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Library_HeadingInputs */

const en_documents_library_heading = /** @type {(inputs: Documents_Library_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Received from clients and missions`)
};

const fr_documents_library_heading = /** @type {(inputs: Documents_Library_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reçus des clients et missions`)
};

/**
* | output |
* | --- |
* | "Received from clients and missions" |
*
* @param {Documents_Library_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_library_heading = /** @type {((inputs?: Documents_Library_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Library_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_library_heading(inputs)
	return en_documents_library_heading(inputs)
});