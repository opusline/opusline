/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Stat_InvoicedInputs */

const en_missions_stat_invoiced = /** @type {(inputs: Missions_Stat_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoiced`)
};

const fr_missions_stat_invoiced = /** @type {(inputs: Missions_Stat_InvoicedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturé`)
};

/**
* | output |
* | --- |
* | "Invoiced" |
*
* @param {Missions_Stat_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_stat_invoiced = /** @type {((inputs?: Missions_Stat_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Stat_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_stat_invoiced(inputs)
	return en_missions_stat_invoiced(inputs)
});