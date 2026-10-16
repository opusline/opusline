/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_PenaltyInputs */

const en_editor_penalty = /** @type {(inputs: Editor_PenaltyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Late-payment penalties (%)`)
};

const fr_editor_penalty = /** @type {(inputs: Editor_PenaltyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pénalités de retard (%)`)
};

/**
* | output |
* | --- |
* | "Late-payment penalties (%)" |
*
* @param {Editor_PenaltyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_penalty = /** @type {((inputs?: Editor_PenaltyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_PenaltyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_penalty(inputs)
	return en_editor_penalty(inputs)
});