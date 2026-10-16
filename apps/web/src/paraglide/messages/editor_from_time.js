/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_From_TimeInputs */

const en_editor_from_time = /** @type {(inputs: Editor_From_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`from tracked time`)
};

const fr_editor_from_time = /** @type {(inputs: Editor_From_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`depuis le temps saisi`)
};

/**
* | output |
* | --- |
* | "from tracked time" |
*
* @param {Editor_From_TimeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_from_time = /** @type {((inputs?: Editor_From_TimeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_From_TimeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_from_time(inputs)
	return en_editor_from_time(inputs)
});