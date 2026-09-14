/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ share: NonNullable<unknown> }} Expenses_Pro_ShareInputs */

const en_expenses_pro_share = /** @type {(inputs: Expenses_Pro_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} % pro`)
};

const fr_expenses_pro_share = /** @type {(inputs: Expenses_Pro_ShareInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.share} % pro`)
};

/**
* | output |
* | --- |
* | "{share} % pro" |
*
* @param {Expenses_Pro_ShareInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_pro_share = /** @type {((inputs: Expenses_Pro_ShareInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Pro_ShareInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_pro_share(inputs)
	return en_expenses_pro_share(inputs)
});