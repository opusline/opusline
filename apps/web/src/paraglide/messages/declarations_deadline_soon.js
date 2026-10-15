/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Declarations_Deadline_SoonInputs */

const en_declarations_deadline_soon = /** @type {(inputs: Declarations_Deadline_SoonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`· in ${i?.count} day`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`· in ${i?.count} days`);
	return /** @type {LocalizedString} */ ("declarations_deadline_soon");
};

const fr_declarations_deadline_soon = /** @type {(inputs: Declarations_Deadline_SoonInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`· dans ${i?.count} j`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`· dans ${i?.count} j`);
	return /** @type {LocalizedString} */ ("declarations_deadline_soon");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "· in {count} day" |
* | "other" | "· in {count} days" |
*
* @param {Declarations_Deadline_SoonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_deadline_soon = /** @type {((inputs: Declarations_Deadline_SoonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Deadline_SoonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_deadline_soon(inputs)
	return en_declarations_deadline_soon(inputs)
});