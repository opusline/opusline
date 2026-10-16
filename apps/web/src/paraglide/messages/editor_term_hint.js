/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ due: NonNullable<unknown> }} Editor_Term_HintInputs */

const en_editor_term_hint = /** @type {(inputs: Editor_Term_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Due on ${i?.due}. The law caps it at 60 days net or 45 days end of month.`)
};

const fr_editor_term_hint = /** @type {(inputs: Editor_Term_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Échéance le ${i?.due}. La loi plafonne à 60 jours nets ou 45 jours fin de mois.`)
};

/**
* | output |
* | --- |
* | "Due on {due}. The law caps it at 60 days net or 45 days end of month." |
*
* @param {Editor_Term_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_term_hint = /** @type {((inputs: Editor_Term_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Term_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_term_hint(inputs)
	return en_editor_term_hint(inputs)
});