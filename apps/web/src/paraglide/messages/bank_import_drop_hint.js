/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_Drop_HintInputs */



/**
* | output |
* | --- |
* | "Drop the file, or click to choose it" |
*
* @param {Bank_Import_Drop_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_drop_hint = /** @type {((inputs?: Bank_Import_Drop_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_Drop_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Déposer le fichier, ou cliquer pour le choisir")
	return /** @type {LocalizedString} */ ("Drop the file, or click to choose it")
});