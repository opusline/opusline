/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Empty_DescriptionInputs */



/**
* | output |
* | --- |
* | "Your active missions have no entries. Start from last week instead of retyping everything." |
*
* @param {Week_Empty_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_empty_description = /** @type {((inputs?: Week_Empty_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Empty_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Vos missions actives n'ont aucune entrée. Repartez de la semaine précédente plutôt que tout ressaisir.")
	return /** @type {LocalizedString} */ ("Your active missions have no entries. Start from last week instead of retyping everything.")
});