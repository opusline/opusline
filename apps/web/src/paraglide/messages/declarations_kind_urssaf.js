/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Kind_UrssafInputs */

const en_declarations_kind_urssaf = /** @type {(inputs: Declarations_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

const fr_declarations_kind_urssaf = /** @type {(inputs: Declarations_Kind_UrssafInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF" |
*
* @param {Declarations_Kind_UrssafInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_kind_urssaf = /** @type {((inputs?: Declarations_Kind_UrssafInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Kind_UrssafInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_kind_urssaf(inputs)
	return en_declarations_kind_urssaf(inputs)
});