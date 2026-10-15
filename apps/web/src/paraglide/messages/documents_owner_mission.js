/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Owner_MissionInputs */

const en_documents_owner_mission = /** @type {(inputs: Documents_Owner_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`mission`)
};

const fr_documents_owner_mission = /** @type {(inputs: Documents_Owner_MissionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`mission`)
};

/**
* | output |
* | --- |
* | "mission" |
*
* @param {Documents_Owner_MissionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_owner_mission = /** @type {((inputs?: Documents_Owner_MissionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Owner_MissionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_owner_mission(inputs)
	return en_documents_owner_mission(inputs)
});