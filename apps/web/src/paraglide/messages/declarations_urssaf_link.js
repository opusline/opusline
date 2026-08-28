/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_LinkInputs */

const en_declarations_urssaf_link = /** @type {(inputs: Declarations_Urssaf_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open autoentrepreneur.urssaf.fr →`)
};

const fr_declarations_urssaf_link = /** @type {(inputs: Declarations_Urssaf_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir autoentrepreneur.urssaf.fr →`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_link(inputs)
	return en_declarations_urssaf_link(inputs)
});