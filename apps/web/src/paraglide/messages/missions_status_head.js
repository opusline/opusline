/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Status_HeadInputs */

const en_missions_status_head = /** @type {(inputs: Missions_Status_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Status`)
};

const fr_missions_status_head = /** @type {(inputs: Missions_Status_HeadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Statut`)
};

/**
* | output |
* | --- |
* | "Status" |
*
* @param {Missions_Status_HeadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_status_head = /** @type {((inputs?: Missions_Status_HeadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Status_HeadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_status_head(inputs)
	return en_missions_status_head(inputs)
});