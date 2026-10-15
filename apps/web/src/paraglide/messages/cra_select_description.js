/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Select_DescriptionInputs */



/**
* | output |
* | --- |
* | "Every month a mission owes a CRA is listed there, newest first. Opening one still owed prepares its grid from the time you tracked." |
*
* @param {Cra_Select_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_select_description = /** @type {((inputs?: Cra_Select_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Select_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Chaque mois dont une mission doit un CRA y est listé, du plus récent au plus ancien. Ouvrir un mois encore dû prépare sa grille à partir du temps que vous avez suivi.")
	return /** @type {LocalizedString} */ ("Every month a mission owes a CRA is listed there, newest first. Opening one still owed prepares its grid from the time you tracked.")
});