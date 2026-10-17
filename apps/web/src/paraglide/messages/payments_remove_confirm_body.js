/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Payments_Remove_Confirm_BodyInputs */

const en_payments_remove_confirm_body = /** @type {(inputs: Payments_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice owes this amount again. A bank movement matched to it is freed for another match.`)
};

const fr_payments_remove_confirm_body = /** @type {(inputs: Payments_Remove_Confirm_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture redevient due de ce montant. Un mouvement bancaire rapproché est libéré pour un autre rapprochement.`)
};

/**
* | output |
* | --- |
* | "The invoice owes this amount again. A bank movement matched to it is freed for another match." |
*
* @param {Payments_Remove_Confirm_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_remove_confirm_body = /** @type {((inputs?: Payments_Remove_Confirm_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Remove_Confirm_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_remove_confirm_body(inputs)
	return en_payments_remove_confirm_body(inputs)
});