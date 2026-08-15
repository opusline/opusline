/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Action_FailedInputs */

const en_common_action_failed = /** @type {(inputs: Common_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The action failed. Try again in a moment.`)
};

const fr_common_action_failed = /** @type {(inputs: Common_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'action a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The action failed. Try again in a moment." |
*
* @param {Common_Action_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_action_failed = /** @type {((inputs?: Common_Action_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Action_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_action_failed(inputs)
	return en_common_action_failed(inputs)
});