/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ share: NonNullable<unknown> }} Declarations_Ceiling_ShareInputs */

const en_declarations_ceiling_share = /** @type {(inputs: Declarations_Ceiling_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} of the micro-BNC ceiling`)
};

const fr_declarations_ceiling_share = /** @type {(inputs: Declarations_Ceiling_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} du plafond micro-BNC`)
};

/**
* | output |
* | --- |
* | "{share} of the micro-BNC ceiling" |
*
* @param {Declarations_Ceiling_ShareInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ceiling_share = /** @type {((inputs: Declarations_Ceiling_ShareInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ceiling_ShareInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ceiling_share(inputs)
	return en_declarations_ceiling_share(inputs)
});