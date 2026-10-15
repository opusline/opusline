/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Group_To_ProduceInputs */

const en_cra_group_to_produce = /** @type {(inputs: Cra_Group_To_ProduceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To produce`)
};

const fr_cra_group_to_produce = /** @type {(inputs: Cra_Group_To_ProduceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À produire`)
};

/**
* | output |
* | --- |
* | "To produce" |
*
* @param {Cra_Group_To_ProduceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_group_to_produce = /** @type {((inputs?: Cra_Group_To_ProduceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Group_To_ProduceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_group_to_produce(inputs)
	return en_cra_group_to_produce(inputs)
});