/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Documents_EmptyInputs */

const en_missions_documents_empty = /** @type {(inputs: Missions_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No documents for this mission. The client's documents also appear here.`)
};

const fr_missions_documents_empty = /** @type {(inputs: Missions_Documents_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun document pour cette mission. Les documents du client apparaissent aussi ici.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_documents_empty(inputs)
	return en_missions_documents_empty(inputs)
});