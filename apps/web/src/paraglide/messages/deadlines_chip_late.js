/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Chip_LateInputs */

const en_deadlines_chip_late = /** @type {(inputs: Deadlines_Chip_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} d ago`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} d ago`);
	return /** @type {LocalizedString} */ ("deadlines_chip_late");
};

const fr_deadlines_chip_late = /** @type {(inputs: Deadlines_Chip_LateInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Il y a ${i?.count} j`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Il y a ${i?.count} j`);
	return /** @type {LocalizedString} */ ("deadlines_chip_late");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} d ago" |
* | "other" | "{count} d ago" |
*
* @param {Deadlines_Chip_LateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_chip_late = /** @type {((inputs: Deadlines_Chip_LateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Chip_LateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_chip_late(inputs)
	return en_deadlines_chip_late(inputs)
});