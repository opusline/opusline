/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_LinkInputs */

const en_declarations_cfe_link = /** @type {(inputs: Declarations_Cfe_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open the professional space →`)
};

const fr_declarations_cfe_link = /** @type {(inputs: Declarations_Cfe_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir l'espace professionnel →`)
};

/**
* | output |
* | --- |
* | "Open the professional space →" |
*
* @param {Declarations_Cfe_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_link = /** @type {((inputs?: Declarations_Cfe_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_link(inputs)
	return en_declarations_cfe_link(inputs)
});