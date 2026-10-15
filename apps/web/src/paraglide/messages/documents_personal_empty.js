/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Personal_EmptyInputs */



/**
* | output |
* | --- |
* | "No administrative piece yet. Kbis, certificate, insurance, bank details and terms of sale belong here." |
*
* @param {Documents_Personal_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_personal_empty = /** @type {((inputs?: Documents_Personal_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Personal_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucune pièce administrative pour l'instant. Kbis, attestation, assurance, RIB et CGV ont leur place ici.")
	return /** @type {LocalizedString} */ ("No administrative piece yet. Kbis, certificate, insurance, bank details and terms of sale belong here.")
});