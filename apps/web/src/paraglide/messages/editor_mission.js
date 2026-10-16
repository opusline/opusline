/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_MissionInputs */

const en_editor_mission = /** @type {(inputs: Editor_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission · to import tracked time`)
};

const fr_editor_mission = /** @type {(inputs: Editor_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission · pour importer le temps saisi`)
};

/**
* | output |
* | --- |
* | "Mission · to import tracked time" |
*
* @param {Editor_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_mission = /** @type {((inputs?: Editor_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_mission(inputs)
	return en_editor_mission(inputs)
});