/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, date: NonNullable<unknown> }} Treasury_Delete_BodyInputs */

const en_treasury_delete_body = /** @type {(inputs: Treasury_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The ${i?.amount} transfer of ${i?.date} will be removed, and the transferable amount worked out again without it.`)
};

const fr_treasury_delete_body = /** @type {(inputs: Treasury_Delete_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le virement de ${i?.amount} du ${i?.date} sera supprimé, et le montant virable recalculé sans lui.`)
};

/**
* | output |
* | --- |
* | "The {amount} transfer of {date} will be removed, and the transferable amount worked out again without it." |
*
* @param {Treasury_Delete_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_delete_body = /** @type {((inputs: Treasury_Delete_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Delete_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_delete_body(inputs)
	return en_treasury_delete_body(inputs)
});