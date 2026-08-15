/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Color_OwnInputs */

const en_missions_color_own = /** @type {(inputs: Missions_Color_OwnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`specific to the mission`)
};

const fr_missions_color_own = /** @type {(inputs: Missions_Color_OwnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`propre à la mission`)
};

/**
* | output |
* | --- |
* | "specific to the mission" |
*
* @param {Missions_Color_OwnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_color_own = /** @type {((inputs?: Missions_Color_OwnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Color_OwnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_color_own(inputs)
	return en_missions_color_own(inputs)
});