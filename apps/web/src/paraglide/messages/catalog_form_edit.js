/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Form_EditInputs */

const en_catalog_form_edit = /** @type {(inputs: Catalog_Form_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the service`)
};

const fr_catalog_form_edit = /** @type {(inputs: Catalog_Form_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier la prestation`)
};

/**
* | output |
* | --- |
* | "Edit the service" |
*
* @param {Catalog_Form_EditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_form_edit = /** @type {((inputs?: Catalog_Form_EditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Form_EditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_form_edit(inputs)
	return en_catalog_form_edit(inputs)
});