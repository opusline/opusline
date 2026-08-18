/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Invoices_Load_FailedInputs */

const en_missions_invoices_load_failed = /** @type {(inputs: Missions_Invoices_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This mission's invoices could not be loaded. Try again in a moment.`)
};

const fr_missions_invoices_load_failed = /** @type {(inputs: Missions_Invoices_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les factures de cette mission n’ont pas pu être chargées. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "This mission's invoices could not be loaded. Try again in a moment." |
*
* @param {Missions_Invoices_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_invoices_load_failed = /** @type {((inputs?: Missions_Invoices_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Invoices_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_invoices_load_failed(inputs)
	return en_missions_invoices_load_failed(inputs)
});