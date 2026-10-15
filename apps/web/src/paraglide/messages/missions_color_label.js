/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Color_LabelInputs */

const en_missions_color_label = /** @type {(inputs: Missions_Color_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Row color`)
};

const fr_missions_color_label = /** @type {(inputs: Missions_Color_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couleur de la ligne`)
};

/**
* | output |
* | --- |
* | "Row color" |
*
* @param {Missions_Color_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_color_label = /** @type {((inputs?: Missions_Color_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Color_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_color_label(inputs)
	return en_missions_color_label(inputs)
});