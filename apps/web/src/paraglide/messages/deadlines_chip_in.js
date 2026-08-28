/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Chip_InInputs */

const en_deadlines_chip_in = /** @type {(inputs: Deadlines_Chip_InInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`In ${i?.count} d`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`In ${i?.count} d`);
	return /** @type {LocalizedString} */ ("deadlines_chip_in");
};

const fr_deadlines_chip_in = /** @type {(inputs: Deadlines_Chip_InInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Dans ${i?.count} j`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Dans ${i?.count} j`);
	return /** @type {LocalizedString} */ ("deadlines_chip_in");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "In {count} d" |
* | "other" | "In {count} d" |
*
* @param {Deadlines_Chip_InInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_chip_in = /** @type {((inputs: Deadlines_Chip_InInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Chip_InInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_chip_in(inputs)
	return en_deadlines_chip_in(inputs)
});