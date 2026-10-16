/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_State_DraftInputs */

const en_quotes_state_draft = /** @type {(inputs: Quotes_State_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`draft`)
};

const fr_quotes_state_draft = /** @type {(inputs: Quotes_State_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`brouillon`)
};

/**
* | output |
* | --- |
* | "draft" |
*
* @param {Quotes_State_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_state_draft = /** @type {((inputs?: Quotes_State_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_State_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_state_draft(inputs)
	return en_quotes_state_draft(inputs)
});