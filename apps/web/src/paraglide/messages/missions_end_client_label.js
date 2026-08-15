/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_End_Client_LabelInputs */

const en_missions_end_client_label = /** @type {(inputs: Missions_End_Client_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`End client`)
};

const fr_missions_end_client_label = /** @type {(inputs: Missions_End_Client_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client final`)
};

/**
* | output |
* | --- |
* | "End client" |
*
* @param {Missions_End_Client_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_end_client_label = /** @type {((inputs?: Missions_End_Client_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_End_Client_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_end_client_label(inputs)
	return en_missions_end_client_label(inputs)
});