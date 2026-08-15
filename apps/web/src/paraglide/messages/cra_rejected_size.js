/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Cra_Rejected_SizeInputs */

const en_cra_rejected_size = /** @type {(inputs: Cra_Rejected_SizeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — 20 MB maximum`)
};

const fr_cra_rejected_size = /** @type {(inputs: Cra_Rejected_SizeInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.name} — 20 Mo maximum`)
};

/**
* | output |
* | --- |
* | "{name} — 20 MB maximum" |
*
* @param {Cra_Rejected_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_rejected_size = /** @type {((inputs: Cra_Rejected_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Rejected_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_rejected_size(inputs)
	return en_cra_rejected_size(inputs)
});