/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Reason_Commercial_GestureInputs */

const en_credit_note_reason_commercial_gesture = /** @type {(inputs: Credit_Note_Reason_Commercial_GestureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commercial gesture`)
};

const fr_credit_note_reason_commercial_gesture = /** @type {(inputs: Credit_Note_Reason_Commercial_GestureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geste commercial`)
};

/**
* | output |
* | --- |
* | "Commercial gesture" |
*
* @param {Credit_Note_Reason_Commercial_GestureInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_reason_commercial_gesture = /** @type {((inputs?: Credit_Note_Reason_Commercial_GestureInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Reason_Commercial_GestureInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_reason_commercial_gesture(inputs)
	return en_credit_note_reason_commercial_gesture(inputs)
});