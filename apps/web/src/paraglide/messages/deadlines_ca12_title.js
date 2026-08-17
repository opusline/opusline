/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Ca12_TitleInputs */

const en_deadlines_ca12_title = /** @type {(inputs: Deadlines_Ca12_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your CA12 is not in this list`)
};

const fr_deadlines_ca12_title = /** @type {(inputs: Deadlines_Ca12_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre CA12 n'est pas dans cette liste`)
};

/**
* | output |
* | --- |
* | "Your CA12 is not in this list" |
*
* @param {Deadlines_Ca12_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_ca12_title = /** @type {((inputs?: Deadlines_Ca12_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Ca12_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_ca12_title(inputs)
	return en_deadlines_ca12_title(inputs)
});