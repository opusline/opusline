/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Lines_IncompleteInputs */

const en_editor_lines_incomplete = /** @type {(inputs: Editor_Lines_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complete every line (name, quantity and price) before saving.`)
};

const fr_editor_lines_incomplete = /** @type {(inputs: Editor_Lines_IncompleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complétez chaque ligne (désignation, quantité et prix) avant d'enregistrer.`)
};

/**
* | output |
* | --- |
* | "Complete every line (name, quantity and price) before saving." |
*
* @param {Editor_Lines_IncompleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_lines_incomplete = /** @type {((inputs?: Editor_Lines_IncompleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Lines_IncompleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_lines_incomplete(inputs)
	return en_editor_lines_incomplete(inputs)
});