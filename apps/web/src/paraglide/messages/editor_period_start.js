/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Period_StartInputs */

const en_editor_period_start = /** @type {(inputs: Editor_Period_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`From`)
};

const fr_editor_period_start = /** @type {(inputs: Editor_Period_StartInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Du`)
};

/**
* | output |
* | --- |
* | "From" |
*
* @param {Editor_Period_StartInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_period_start = /** @type {((inputs?: Editor_Period_StartInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Period_StartInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_period_start(inputs)
	return en_editor_period_start(inputs)
});