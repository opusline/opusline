/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Library_EmptyInputs */



/**
* | output |
* | --- |
* | "No document received yet. Everything you file on a client or a mission shows up here." |
*
* @param {Documents_Library_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_library_empty = /** @type {((inputs?: Documents_Library_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Library_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucun document reçu pour l'instant. Tout ce que vous classez sur un client ou une mission apparaît ici.")
	return /** @type {LocalizedString} */ ("No document received yet. Everything you file on a client or a mission shows up here.")
});