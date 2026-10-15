/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_LinkInputs */



/**
* | output |
* | --- |
* | "Open autoentrepreneur.urssaf.fr →" |
*
* @param {Declarations_Urssaf_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_link = /** @type {((inputs?: Declarations_Urssaf_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ouvrir autoentrepreneur.urssaf.fr →")
	return /** @type {LocalizedString} */ ("Open autoentrepreneur.urssaf.fr →")
});