/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Penalty_HintInputs */

const en_invoicing_penalty_hint = /** @type {(inputs: Invoicing_Penalty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A rate of your choice, at least three times the legal interest rate. With no rate written, the ECB rate plus 10 points applies.`)
};

const fr_invoicing_penalty_hint = /** @type {(inputs: Invoicing_Penalty_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux libre, au moins égal à trois fois le taux d'intérêt légal. Sans taux écrit, c'est le taux BCE + 10 points qui s'applique.`)
};

/**
* | output |
* | --- |
* | "A rate of your choice, at least three times the legal interest rate. With no rate written, the ECB rate plus 10 points applies." |
*
* @param {Invoicing_Penalty_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_hint = /** @type {((inputs?: Invoicing_Penalty_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_hint(inputs)
	return en_invoicing_penalty_hint(inputs)
});