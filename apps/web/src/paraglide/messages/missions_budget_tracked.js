/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Budget_TrackedInputs */

const en_missions_budget_tracked = /** @type {(inputs: Missions_Budget_TrackedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracked`)
};

const fr_missions_budget_tracked = /** @type {(inputs: Missions_Budget_TrackedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivi`)
};

/**
* | output |
* | --- |
* | "Tracked" |
*
* @param {Missions_Budget_TrackedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_tracked = /** @type {((inputs?: Missions_Budget_TrackedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_TrackedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_tracked(inputs)
	return en_missions_budget_tracked(inputs)
});