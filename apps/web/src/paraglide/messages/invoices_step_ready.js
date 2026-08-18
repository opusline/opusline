/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Step_ReadyInputs */

const en_invoices_step_ready = /** @type {(inputs: Invoices_Step_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`marked ready`)
};

const fr_invoices_step_ready = /** @type {(inputs: Invoices_Step_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`marquée prête`)
};

/**
* | output |
* | --- |
* | "marked ready" |
*
* @param {Invoices_Step_ReadyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_step_ready = /** @type {((inputs?: Invoices_Step_ReadyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Step_ReadyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_step_ready(inputs)
	return en_invoices_step_ready(inputs)
});