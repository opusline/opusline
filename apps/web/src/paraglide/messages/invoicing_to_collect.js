/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_To_CollectInputs */

const en_invoicing_to_collect = /** @type {(inputs: Invoicing_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To collect`)
};

const fr_invoicing_to_collect = /** @type {(inputs: Invoicing_To_CollectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À encaisser`)
};

/**
* | output |
* | --- |
* | "To collect" |
*
* @param {Invoicing_To_CollectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_to_collect = /** @type {((inputs?: Invoicing_To_CollectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_To_CollectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_to_collect(inputs)
	return en_invoicing_to_collect(inputs)
});