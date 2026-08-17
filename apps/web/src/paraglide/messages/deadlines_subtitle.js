/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_SubtitleInputs */

const en_deadlines_subtitle = /** @type {(inputs: Deadlines_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What you owe the fisc and when, computed on what your clients actually paid.`)
};

const fr_deadlines_subtitle = /** @type {(inputs: Deadlines_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce que vous devez au fisc et quand, calculé sur ce que vos clients ont réellement payé.`)
};

/**
* | output |
* | --- |
* | "What you owe the fisc and when, computed on what your clients actually paid." |
*
* @param {Deadlines_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_subtitle = /** @type {((inputs?: Deadlines_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_subtitle(inputs)
	return en_deadlines_subtitle(inputs)
});