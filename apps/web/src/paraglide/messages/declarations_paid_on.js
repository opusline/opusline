/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Paid_OnInputs */

const en_declarations_paid_on = /** @type {(inputs: Declarations_Paid_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Paid on ${i?.date} (business account)`)
};

const fr_declarations_paid_on = /** @type {(inputs: Declarations_Paid_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Payée le ${i?.date} (compte pro)`)
};

/**
* | output |
* | --- |
* | "Paid on {date} (business account)" |
*
* @param {Declarations_Paid_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_paid_on = /** @type {((inputs: Declarations_Paid_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Paid_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_paid_on(inputs)
	return en_declarations_paid_on(inputs)
});