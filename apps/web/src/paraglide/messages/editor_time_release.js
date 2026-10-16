/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Time_ReleaseInputs */

const en_editor_time_release = /** @type {(inputs: Editor_Time_ReleaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Release`)
};

const fr_editor_time_release = /** @type {(inputs: Editor_Time_ReleaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délier`)
};

/**
* | output |
* | --- |
* | "Release" |
*
* @param {Editor_Time_ReleaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_time_release = /** @type {((inputs?: Editor_Time_ReleaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Time_ReleaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_time_release(inputs)
	return en_editor_time_release(inputs)
});