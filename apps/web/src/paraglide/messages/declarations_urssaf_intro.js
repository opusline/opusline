/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_IntroInputs */

const en_declarations_urssaf_intro = /** @type {(inputs: Declarations_Urssaf_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The figure to retype on autoentrepreneur.urssaf.fr — on the collected basis, not the invoiced one.`)
};

const fr_declarations_urssaf_intro = /** @type {(inputs: Declarations_Urssaf_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le chiffre à recopier sur autoentrepreneur.urssaf.fr — base encaissée, pas facturée.`)
};

/**
* | output |
* | --- |
* | "The figure to retype on autoentrepreneur.urssaf.fr — on the collected basis, not the invoiced one." |
*
* @param {Declarations_Urssaf_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_intro = /** @type {((inputs?: Declarations_Urssaf_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_intro(inputs)
	return en_declarations_urssaf_intro(inputs)
});