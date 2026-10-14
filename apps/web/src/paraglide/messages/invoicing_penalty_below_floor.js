/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Invoicing_Penalty_Below_FloorInputs */

const en_invoicing_penalty_below_floor = /** @type {(inputs: Invoicing_Penalty_Below_FloorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Below the legal minimum: the rate cannot be lower than three times the legal interest rate, ${i?.rate} % this semester.`)
};

const fr_invoicing_penalty_below_floor = /** @type {(inputs: Invoicing_Penalty_Below_FloorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`En dessous du minimum légal : le taux ne peut être inférieur à trois fois le taux d'intérêt légal, soit ${i?.rate} % ce semestre.`)
};

/**
* | output |
* | --- |
* | "Below the legal minimum: the rate cannot be lower than three times the legal interest rate, {rate} % this semester." |
*
* @param {Invoicing_Penalty_Below_FloorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_below_floor = /** @type {((inputs: Invoicing_Penalty_Below_FloorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_Below_FloorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_below_floor(inputs)
	return en_invoicing_penalty_below_floor(inputs)
});