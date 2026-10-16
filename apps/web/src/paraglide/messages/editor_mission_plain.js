/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Mission_PlainInputs */

const en_editor_mission_plain = /** @type {(inputs: Editor_Mission_PlainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission · optional`)
};

const fr_editor_mission_plain = /** @type {(inputs: Editor_Mission_PlainInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission · facultatif`)
};

/**
* | output |
* | --- |
* | "Mission · optional" |
*
* @param {Editor_Mission_PlainInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_mission_plain = /** @type {((inputs?: Editor_Mission_PlainInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Mission_PlainInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_mission_plain(inputs)
	return en_editor_mission_plain(inputs)
});