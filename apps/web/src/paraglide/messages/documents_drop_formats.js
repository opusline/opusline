/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Drop_FormatsInputs */



/**
* | output |
* | --- |
* | "PDF, images or Office documents — 20 MB max" |
*
* @param {Documents_Drop_FormatsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_drop_formats = /** @type {((inputs?: Documents_Drop_FormatsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Drop_FormatsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("PDF, images ou documents Office — 20 Mo max")
	return /** @type {LocalizedString} */ ("PDF, images or Office documents — 20 MB max")
});