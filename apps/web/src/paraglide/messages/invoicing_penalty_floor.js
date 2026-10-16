/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Invoicing_Penalty_FloorInputs */

const en_invoicing_penalty_floor = /** @type {(inputs: Invoicing_Penalty_FloorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Legal minimum · ${i?.rate} %`)
};

const fr_invoicing_penalty_floor = /** @type {(inputs: Invoicing_Penalty_FloorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Minimum légal · ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "Legal minimum · {rate} %" |
*
* @param {Invoicing_Penalty_FloorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_penalty_floor = /** @type {((inputs: Invoicing_Penalty_FloorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Penalty_FloorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_penalty_floor(inputs)
	return en_invoicing_penalty_floor(inputs)
});