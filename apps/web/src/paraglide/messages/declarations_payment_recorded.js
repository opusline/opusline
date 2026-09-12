/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Payment_RecordedInputs */

const en_declarations_payment_recorded = /** @type {(inputs: Declarations_Payment_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment recorded · debited from the business account`)
};

const fr_declarations_payment_recorded = /** @type {(inputs: Declarations_Payment_RecordedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiement enregistré · prélèvement sur le compte pro`)
};

/**
* | output |
* | --- |
* | "Payment recorded · debited from the business account" |
*
* @param {Declarations_Payment_RecordedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_payment_recorded = /** @type {((inputs?: Declarations_Payment_RecordedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Payment_RecordedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_payment_recorded(inputs)
	return en_declarations_payment_recorded(inputs)
});