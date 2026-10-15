/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Due_InInputs */

const en_deadlines_due_in = /** @type {(inputs: Deadlines_Due_InInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`in ${i?.count} day`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`in ${i?.count} days`);
	return /** @type {LocalizedString} */ ("deadlines_due_in");
};

const fr_deadlines_due_in = /** @type {(inputs: Deadlines_Due_InInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`dans ${i?.count} jour`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`dans ${i?.count} jours`);
	return /** @type {LocalizedString} */ ("deadlines_due_in");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "in {count} day" |
* | "other" | "in {count} days" |
*
* @param {Deadlines_Due_InInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_due_in = /** @type {((inputs: Deadlines_Due_InInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Due_InInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_due_in(inputs)
	return en_deadlines_due_in(inputs)
});