/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Source_Late_PenaltiesInputs */

const en_invoicing_source_late_penalties = /** @type {(inputs: Invoicing_Source_Late_PenaltiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Computing late-payment penalties · Shine help`)
};

const fr_invoicing_source_late_penalties = /** @type {(inputs: Invoicing_Source_Late_PenaltiesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calcul des pénalités de retard · aide Shine`)
};

/**
* | output |
* | --- |
* | "Computing late-payment penalties · Shine help" |
*
* @param {Invoicing_Source_Late_PenaltiesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_source_late_penalties = /** @type {((inputs?: Invoicing_Source_Late_PenaltiesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Source_Late_PenaltiesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_source_late_penalties(inputs)
	return en_invoicing_source_late_penalties(inputs)
});