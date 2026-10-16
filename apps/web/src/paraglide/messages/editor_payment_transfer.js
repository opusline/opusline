/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ iban: NonNullable<unknown> }} Editor_Payment_TransferInputs */

const en_editor_payment_transfer = /** @type {(inputs: Editor_Payment_TransferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bank transfer · ${i?.iban}`)
};

const fr_editor_payment_transfer = /** @type {(inputs: Editor_Payment_TransferInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Virement bancaire · ${i?.iban}`)
};

/**
* | output |
* | --- |
* | "Bank transfer · {iban}" |
*
* @param {Editor_Payment_TransferInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_payment_transfer = /** @type {((inputs: Editor_Payment_TransferInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Payment_TransferInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_payment_transfer(inputs)
	return en_editor_payment_transfer(inputs)
});