/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_New_SubtitleInputs */

const en_missions_new_subtitle = /** @type {(inputs: Missions_New_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A mission = a row in the week grid, and a rate that values it.`)
};

const fr_missions_new_subtitle = /** @type {(inputs: Missions_New_SubtitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une mission = une ligne dans la grille de la semaine, et un tarif qui la valorise.`)
};

/**
* | output |
* | --- |
* | "A mission = a row in the week grid, and a rate that values it." |
*
* @param {Missions_New_SubtitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_new_subtitle = /** @type {((inputs?: Missions_New_SubtitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_New_SubtitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_new_subtitle(inputs)
	return en_missions_new_subtitle(inputs)
});