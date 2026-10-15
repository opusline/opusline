/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Drop_HintInputs */



/**
* | output |
* | --- |
* | "Drag files here or click to browse" |
*
* @param {Documents_Drop_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_drop_hint = /** @type {((inputs?: Documents_Drop_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Drop_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Glissez des fichiers ici ou cliquez pour parcourir")
	return /** @type {LocalizedString} */ ("Drag files here or click to browse")
});