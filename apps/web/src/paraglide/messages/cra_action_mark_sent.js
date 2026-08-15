/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Action_Mark_SentInputs */

const en_cra_action_mark_sent = /** @type {(inputs: Cra_Action_Mark_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as sent`)
};

const fr_cra_action_mark_sent = /** @type {(inputs: Cra_Action_Mark_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer envoyé`)
};

/**
* | output |
* | --- |
* | "Mark as sent" |
*
* @param {Cra_Action_Mark_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_action_mark_sent = /** @type {((inputs?: Cra_Action_Mark_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Action_Mark_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_action_mark_sent(inputs)
	return en_cra_action_mark_sent(inputs)
});