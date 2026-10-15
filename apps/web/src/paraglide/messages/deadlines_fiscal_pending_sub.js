/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Fiscal_Pending_SubInputs */

const en_deadlines_fiscal_pending_sub = /** @type {(inputs: Deadlines_Fiscal_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Computed from the period's collections`)
};

const fr_deadlines_fiscal_pending_sub = /** @type {(inputs: Deadlines_Fiscal_Pending_SubInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Calculée sur les encaissements de la période`)
};

/**
* | output |
* | --- |
* | "Computed from the period's collections" |
*
* @param {Deadlines_Fiscal_Pending_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_fiscal_pending_sub = /** @type {((inputs?: Deadlines_Fiscal_Pending_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Fiscal_Pending_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_fiscal_pending_sub(inputs)
	return en_deadlines_fiscal_pending_sub(inputs)
});