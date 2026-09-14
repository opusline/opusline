/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_IntroInputs */

const en_declarations_intro = /** @type {(inputs: Declarations_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The figures to retype, month by month. Mark each filing once it is done.`)
};

const fr_declarations_intro = /** @type {(inputs: Declarations_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les chiffres à recopier, mois par mois. Marquez chaque déclaration une fois déposée.`)
};

/**
* | output |
* | --- |
* | "The figures to retype, month by month. Mark each filing once it is done." |
*
* @param {Declarations_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_intro = /** @type {((inputs?: Declarations_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_intro(inputs)
	return en_declarations_intro(inputs)
});