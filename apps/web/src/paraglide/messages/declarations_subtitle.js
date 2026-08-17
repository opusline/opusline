/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_SubtitleInputs */

const en_declarations_subtitle = /** @type {(inputs: Declarations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Every period you owe a return for, and the ones you have already filed. Opusline files nothing — tick a period off once you have declared it.`)
};

const fr_declarations_subtitle = /** @type {(inputs: Declarations_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chaque période à déclarer, et celles que vous avez déjà déposées. Opusline ne déclare rien — cochez une période une fois déclarée.`)
};

/**
* | output |
* | --- |
* | "Every period you owe a return for, and the ones you have already filed. Opusline files nothing — tick a period off once you have declared it." |
*
* @param {Declarations_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_subtitle = /** @type {((inputs?: Declarations_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_subtitle(inputs)
	return en_declarations_subtitle(inputs)
});