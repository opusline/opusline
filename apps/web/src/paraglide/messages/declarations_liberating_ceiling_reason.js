/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ ceiling: NonNullable<unknown> }} Declarations_Liberating_Ceiling_ReasonInputs */

const en_declarations_liberating_ceiling_reason = /** @type {(inputs: Declarations_Liberating_Ceiling_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your receipts crossed the micro-BNC ceiling (${i?.ceiling}) two years running: the micro régime ends, and the option with it.`)
};

const fr_declarations_liberating_ceiling_reason = /** @type {(inputs: Declarations_Liberating_Ceiling_ReasonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vos recettes ont dépassé le plafond micro-BNC (${i?.ceiling}) deux années de suite : le régime micro s'arrête, et l'option avec lui.`)
};

/**
* | output |
* | --- |
* | "Your receipts crossed the micro-BNC ceiling ({ceiling}) two years running: the micro régime ends, and the option with it." |
*
* @param {Declarations_Liberating_Ceiling_ReasonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ceiling_reason = /** @type {((inputs: Declarations_Liberating_Ceiling_ReasonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ceiling_ReasonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_ceiling_reason(inputs)
	return en_declarations_liberating_ceiling_reason(inputs)
});