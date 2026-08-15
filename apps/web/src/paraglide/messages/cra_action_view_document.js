/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Action_View_DocumentInputs */

const en_cra_action_view_document = /** @type {(inputs: Cra_Action_View_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`View the document`)
};

const fr_cra_action_view_document = /** @type {(inputs: Cra_Action_View_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir le document`)
};

/**
* | output |
* | --- |
* | "View the document" |
*
* @param {Cra_Action_View_DocumentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_action_view_document = /** @type {((inputs?: Cra_Action_View_DocumentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Action_View_DocumentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_action_view_document(inputs)
	return en_cra_action_view_document(inputs)
});