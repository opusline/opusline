/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_LoadingInputs */

const en_invoices_add_loading = /** @type {(inputs: Invoices_Add_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading your missions…`)
};

const fr_invoices_add_loading = /** @type {(inputs: Invoices_Add_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chargement de vos missions…`)
};

/**
* | output |
* | --- |
* | "Loading your missions…" |
*
* @param {Invoices_Add_LoadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_loading = /** @type {((inputs?: Invoices_Add_LoadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_LoadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_loading(inputs)
	return en_invoices_add_loading(inputs)
});