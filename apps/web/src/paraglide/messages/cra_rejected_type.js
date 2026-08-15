/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Cra_Rejected_TypeInputs */

const en_cra_rejected_type = /** @type {(inputs: Cra_Rejected_TypeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — a signed CRA is a PDF or an image`)
};

const fr_cra_rejected_type = /** @type {(inputs: Cra_Rejected_TypeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — un CRA signé est un PDF ou une image`)
};

/**
* | output |
* | --- |
* | "{name} — a signed CRA is a PDF or an image" |
*
* @param {Cra_Rejected_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_rejected_type = /** @type {((inputs: Cra_Rejected_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Rejected_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_rejected_type(inputs)
	return en_cra_rejected_type(inputs)
});