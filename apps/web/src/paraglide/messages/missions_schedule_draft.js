/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_DraftInputs */

const en_missions_schedule_draft = /** @type {(inputs: Missions_Schedule_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft invoice`)
};

const fr_missions_schedule_draft = /** @type {(inputs: Missions_Schedule_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture en brouillon`)
};

/**
* | output |
* | --- |
* | "Draft invoice" |
*
* @param {Missions_Schedule_DraftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_draft = /** @type {((inputs?: Missions_Schedule_DraftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_DraftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_draft(inputs)
	return en_missions_schedule_draft(inputs)
});