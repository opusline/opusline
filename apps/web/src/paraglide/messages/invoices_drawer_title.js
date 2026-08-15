/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Drawer_TitleInputs */

const en_invoices_drawer_title = /** @type {(inputs: Invoices_Drawer_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice`)
};

const fr_invoices_drawer_title = /** @type {(inputs: Invoices_Drawer_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture`)
};

/**
* | output |
* | --- |
* | "Invoice" |
*
* @param {Invoices_Drawer_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_drawer_title = /** @type {((inputs?: Invoices_Drawer_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Drawer_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_drawer_title(inputs)
	return en_invoices_drawer_title(inputs)
});