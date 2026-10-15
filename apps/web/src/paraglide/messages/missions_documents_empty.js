/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Documents_EmptyInputs */



/**
* | output |
* | --- |
* | "No documents for this mission. The client's documents also appear here." |
*
* @param {Missions_Documents_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_documents_empty = /** @type {((inputs?: Missions_Documents_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Documents_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucun document pour cette mission. Les documents du client apparaissent aussi ici.")
	return /** @type {LocalizedString} */ ("No documents for this mission. The client's documents also appear here.")
});