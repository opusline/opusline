/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Catalog_Label_RequiredInputs */

const en_catalog_label_required = /** @type {(inputs: Catalog_Label_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Give the service a name`)
};

const fr_catalog_label_required = /** @type {(inputs: Catalog_Label_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Donnez un nom à la prestation`)
};

/**
* | output |
* | --- |
* | "Give the service a name" |
*
* @param {Catalog_Label_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const catalog_label_required = /** @type {((inputs?: Catalog_Label_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Catalog_Label_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_catalog_label_required(inputs)
	return en_catalog_label_required(inputs)
});