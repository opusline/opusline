/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Cra_To_ProduceInputs */

const en_cra_to_produce = /** @type {(inputs: Cra_To_ProduceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} to produce`)
};

const fr_cra_to_produce = /** @type {(inputs: Cra_To_ProduceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} à produire`)
};

/**
* | output |
* | --- |
* | "{count} to produce" |
*
* @param {Cra_To_ProduceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_to_produce = /** @type {((inputs: Cra_To_ProduceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_To_ProduceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_to_produce(inputs)
	return en_cra_to_produce(inputs)
});