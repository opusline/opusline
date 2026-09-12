/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Cfe_Paid_BookedInputs */

const en_declarations_cfe_paid_booked = /** @type {(inputs: Declarations_Cfe_Paid_BookedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CFE marked as paid · « Taxes » expense booked (${i?.amount}, no TVA)`)
};

const fr_declarations_cfe_paid_booked = /** @type {(inputs: Declarations_Cfe_Paid_BookedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CFE marquée payée · dépense « Taxes » créée (${i?.amount}, hors TVA)`)
};

/**
* | output |
* | --- |
* | "CFE marked as paid · « Taxes » expense booked ({amount}, no TVA)" |
*
* @param {Declarations_Cfe_Paid_BookedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_paid_booked = /** @type {((inputs: Declarations_Cfe_Paid_BookedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Paid_BookedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_paid_booked(inputs)
	return en_declarations_cfe_paid_booked(inputs)
});