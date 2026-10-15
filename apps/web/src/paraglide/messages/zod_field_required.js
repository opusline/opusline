/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Zod_Field_RequiredInputs */

const en_zod_field_required = /** @type {(inputs: Zod_Field_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This field is required.`)
};

const fr_zod_field_required = /** @type {(inputs: Zod_Field_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce champ est requis.`)
};

/**
* | output |
* | --- |
* | "This field is required." |
*
* @param {Zod_Field_RequiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const zod_field_required = /** @type {((inputs?: Zod_Field_RequiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Zod_Field_RequiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_zod_field_required(inputs)
	return en_zod_field_required(inputs)
});