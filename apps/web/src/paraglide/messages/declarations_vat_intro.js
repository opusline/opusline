/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Vat_IntroInputs */

const en_declarations_vat_intro = /** @type {(inputs: Declarations_Vat_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Each row maps to one box of form n° 3310-CA3, to retype on impots.gouv.fr.`)
};

const fr_declarations_vat_intro = /** @type {(inputs: Declarations_Vat_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque ligne correspond à une case du formulaire n° 3310-CA3, à recopier sur impots.gouv.fr.`)
};

/**
* | output |
* | --- |
* | "Each row maps to one box of form n° 3310-CA3, to retype on impots.gouv.fr." |
*
* @param {Declarations_Vat_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_vat_intro = /** @type {((inputs?: Declarations_Vat_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Vat_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_vat_intro(inputs)
	return en_declarations_vat_intro(inputs)
});