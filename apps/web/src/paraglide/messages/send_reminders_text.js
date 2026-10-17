/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Reminders_TextInputs */

const en_send_reminders_text = /** @type {(inputs: Send_Reminders_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`If nothing is collected by the due date, Opusline follows up with the « Payment reminder » template, and stops as soon as a payment is matched.`)
};

const fr_send_reminders_text = /** @type {(inputs: Send_Reminders_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Si rien n'est encaissé à l'échéance, Opusline relance avec le modèle « Relance de paiement », et s'arrête dès le rapprochement.`)
};

/**
* | output |
* | --- |
* | "If nothing is collected by the due date, Opusline follows up with the « Payment reminder » template, and stops as soon as a payment is matched." |
*
* @param {Send_Reminders_TextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_reminders_text = /** @type {((inputs?: Send_Reminders_TextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Reminders_TextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_reminders_text(inputs)
	return en_send_reminders_text(inputs)
});