/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rounding_HelpInputs */

const en_missions_rounding_help = /** @type {(inputs: Missions_Rounding_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What is rounding?`)
};

const fr_missions_rounding_help = /** @type {(inputs: Missions_Rounding_HelpInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Qu'est-ce que l'arrondi ?`)
};

/**
* | output |
* | --- |
* | "What is rounding?" |
*
* @param {Missions_Rounding_HelpInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rounding_help = /** @type {((inputs?: Missions_Rounding_HelpInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rounding_HelpInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rounding_help(inputs)
	return en_missions_rounding_help(inputs)
});