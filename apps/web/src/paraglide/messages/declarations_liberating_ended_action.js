/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Liberating_Ended_ActionInputs */

const en_declarations_liberating_ended_action = /** @type {(inputs: Declarations_Liberating_Ended_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn it off in the settings.`)
};

const fr_declarations_liberating_ended_action = /** @type {(inputs: Declarations_Liberating_Ended_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactivez-le dans les réglages.`)
};

/**
* | output |
* | --- |
* | "Turn it off in the settings." |
*
* @param {Declarations_Liberating_Ended_ActionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_ended_action = /** @type {((inputs?: Declarations_Liberating_Ended_ActionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Ended_ActionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_ended_action(inputs)
	return en_declarations_liberating_ended_action(inputs)
});