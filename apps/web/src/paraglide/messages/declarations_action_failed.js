/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Action_FailedInputs */

const en_declarations_action_failed = /** @type {(inputs: Declarations_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The filing could not be updated. Try again in a moment.`)
};

const fr_declarations_action_failed = /** @type {(inputs: Declarations_Action_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La déclaration n'a pas pu être mise à jour. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The filing could not be updated. Try again in a moment." |
*
* @param {Declarations_Action_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_action_failed = /** @type {((inputs?: Declarations_Action_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Action_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_action_failed(inputs)
	return en_declarations_action_failed(inputs)
});