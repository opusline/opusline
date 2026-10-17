/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Reason_Service_CancelledInputs */

const en_credit_note_reason_service_cancelled = /** @type {(inputs: Credit_Note_Reason_Service_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service cancelled`)
};

const fr_credit_note_reason_service_cancelled = /** @type {(inputs: Credit_Note_Reason_Service_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prestation annulée`)
};

/**
* | output |
* | --- |
* | "Service cancelled" |
*
* @param {Credit_Note_Reason_Service_CancelledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_reason_service_cancelled = /** @type {((inputs?: Credit_Note_Reason_Service_CancelledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Reason_Service_CancelledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_reason_service_cancelled(inputs)
	return en_credit_note_reason_service_cancelled(inputs)
});