/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Cra_State_Sent_OnInputs */

const en_cra_state_sent_on = /** @type {(inputs: Cra_State_Sent_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sent on ${i?.date}`)
};

const fr_cra_state_sent_on = /** @type {(inputs: Cra_State_Sent_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoyé le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Sent on {date}" |
*
* @param {Cra_State_Sent_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_state_sent_on = /** @type {((inputs: Cra_State_Sent_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_State_Sent_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_state_sent_on(inputs)
	return en_cra_state_sent_on(inputs)
});