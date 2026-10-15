/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_More_ActionsInputs */

const en_common_more_actions = /** @type {(inputs: Common_More_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More actions`)
};

const fr_common_more_actions = /** @type {(inputs: Common_More_ActionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Plus d'actions`)
};

/**
* | output |
* | --- |
* | "More actions" |
*
* @param {Common_More_ActionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_more_actions = /** @type {((inputs?: Common_More_ActionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_More_ActionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_more_actions(inputs)
	return en_common_more_actions(inputs)
});