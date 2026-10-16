/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Category_ServicesInputs */

const en_invoicing_category_services = /** @type {(inputs: Invoicing_Category_ServicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provision of services`)
};

const fr_invoicing_category_services = /** @type {(inputs: Invoicing_Category_ServicesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prestation de services`)
};

/**
* | output |
* | --- |
* | "Provision of services" |
*
* @param {Invoicing_Category_ServicesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_category_services = /** @type {((inputs?: Invoicing_Category_ServicesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Category_ServicesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_category_services(inputs)
	return en_invoicing_category_services(inputs)
});