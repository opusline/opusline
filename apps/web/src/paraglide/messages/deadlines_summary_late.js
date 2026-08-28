/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Summary_LateInputs */

const en_deadlines_summary_late = /** @type {(inputs: Deadlines_Summary_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} late`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} late`);
	return /** @type {LocalizedString} */ ("deadlines_summary_late");
};

const fr_deadlines_summary_late = /** @type {(inputs: Deadlines_Summary_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} en retard`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} en retard`);
	return /** @type {LocalizedString} */ ("deadlines_summary_late");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} late" |
* | "other" | "{count} late" |
*
* @param {Deadlines_Summary_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_summary_late = /** @type {((inputs: Deadlines_Summary_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Summary_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_summary_late(inputs)
	return en_deadlines_summary_late(inputs)
});