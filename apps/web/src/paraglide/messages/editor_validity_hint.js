/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Editor_Validity_HintInputs */

const en_editor_validity_hint = /** @type {(inputs: Editor_Validity_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Counted from the day it is validated: until ${i?.date} if validated today.`)
};

const fr_editor_validity_hint = /** @type {(inputs: Editor_Validity_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Comptée à partir du jour de la validation : jusqu'au ${i?.date} si validé aujourd'hui.`)
};

/**
* | output |
* | --- |
* | "Counted from the day it is validated: until {date} if validated today." |
*
* @param {Editor_Validity_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_validity_hint = /** @type {((inputs: Editor_Validity_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Validity_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_validity_hint(inputs)
	return en_editor_validity_hint(inputs)
});