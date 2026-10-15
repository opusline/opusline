/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Week_Empty_DescriptionInputs */

const en_week_empty_description = /** @type {(inputs: Week_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your active missions have no entries. Start from last week instead of retyping everything.`)
};

const fr_week_empty_description = /** @type {(inputs: Week_Empty_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos missions actives n'ont aucune entrée. Repartez de la semaine précédente plutôt que tout ressaisir.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_empty_description(inputs)
	return en_week_empty_description(inputs)
});