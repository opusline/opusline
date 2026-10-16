/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Mission_NoneInputs */

const en_editor_mission_none = /** @type {(inputs: Editor_Mission_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No mission`)
};

const fr_editor_mission_none = /** @type {(inputs: Editor_Mission_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune mission`)
};

/**
* | output |
* | --- |
* | "No mission" |
*
* @param {Editor_Mission_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_mission_none = /** @type {((inputs?: Editor_Mission_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Mission_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_mission_none(inputs)
	return en_editor_mission_none(inputs)
});