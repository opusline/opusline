/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Form_NewInputs */

const en_catalog_form_new = /** @type {(inputs: Catalog_Form_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New service`)
};

const fr_catalog_form_new = /** @type {(inputs: Catalog_Form_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouvelle prestation`)
};

/**
* | output |
* | --- |
* | "New service" |
*
* @param {Catalog_Form_NewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_form_new = /** @type {((inputs?: Catalog_Form_NewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Form_NewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_form_new(inputs)
	return en_catalog_form_new(inputs)
});