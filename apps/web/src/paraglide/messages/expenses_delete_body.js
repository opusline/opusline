/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown>, amount: NonNullable<unknown>, date: NonNullable<unknown> }} Expenses_Delete_BodyInputs */

const en_expenses_delete_body = /** @type {(inputs: Expenses_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · ${i?.amount} on ${i?.date}. The receipt goes with it; the TVA it carried leaves the CA3.`)
};

const fr_expenses_delete_body = /** @type {(inputs: Expenses_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.supplier} · ${i?.amount} le ${i?.date}. La facture part avec elle ; la TVA qu'elle portait sort de la CA3.`)
};

/**
* | output |
* | --- |
* | "{supplier} · {amount} on {date}. The receipt goes with it; the TVA it carried leaves the CA3." |
*
* @param {Expenses_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_delete_body = /** @type {((inputs: Expenses_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_delete_body(inputs)
	return en_expenses_delete_body(inputs)
});