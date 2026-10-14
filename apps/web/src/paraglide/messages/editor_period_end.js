/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Period_EndInputs */

const en_editor_period_end = /** @type {(inputs: Editor_Period_EndInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To`)
};

const fr_editor_period_end = /** @type {(inputs: Editor_Period_EndInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Au`)
};

/**
* | output |
* | --- |
* | "To" |
*
* @param {Editor_Period_EndInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_period_end = /** @type {((inputs?: Editor_Period_EndInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Period_EndInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_period_end(inputs)
	return en_editor_period_end(inputs)
});