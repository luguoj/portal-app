import {FilterOptions, Sign, Operation, ValueRange} from "@/modules/psr-entity-crud/FilterOptions"

export class FilterOptionsBuilder {
    constructor(filterOptions) {
        this.filterOptions = filterOptions || new FilterOptions()
    }

    field(name) {
        const valueRangesBuilder = new ValueRangesBuilder(this)
        this.filterOptions.put(name, valueRangesBuilder.valueRanges)
        return valueRangesBuilder
    }

    get() {
        return this.filterOptions
    }
}

function checkNull(value) {
    return value == null || value === ''
}

function checkEmpty(collect) {
    return collect == null || !collect.length
}

class ValueRangesBuilder {
    constructor(filterOptionsBuilder) {
        this.filterOptionsBuilder = filterOptionsBuilder
        this.valueRanges = []
    }

    then() {
        return this.filterOptionsBuilder
    }

    rangeValue(sign, operation, from, to) {
        const valueRange = new ValueRange(sign, operation)
        valueRange.setFrom(from).setTo(to)
        this.valueRanges.push(valueRange)
        return this
    }

    collectValue(sign, operation, collect) {
        const valueRange = new ValueRange(sign, operation)
        valueRange.setCollect(collect)
        this.valueRanges.push(valueRange)
        return this
    }

    iEqual(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.EQUAL, from)
    }

    eEqual(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.EQUAL, from)
    }

    iNEqual(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.NOT_EQUAL, from)
    }

    eNEqual(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.NOT_EQUAL, from)
    }


    iLike(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.LIKE, from)
    }

    eLike(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.LIKE, from)
    }

    iNLike(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.NOT_LIKE, from)
    }

    eNLike(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.NOT_LIKE, from)
    }

    iGT(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN, from)
    }

    eGT(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN, from)
    }

    iLT(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN, from)
    }

    eLT(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN, from)
    }

    iGE(from) {

        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
    }

    eGE(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
    }

    iLE(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN_OR_EQUAL, from)
    }

    eLE(from) {
        return checkNull(from) ? this : this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN_OR_EQUAL, from)
    }

    iBT(from, to) {
        if (!checkNull(from) && !checkNull(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.BETWEEN, from, to)
        } else if (!checkNull(from)) {
            return this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
        } else if (!checkNull(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN_OR_EQUAL, to)
        } else {
            return this
        }
    }

    eBT(from, to) {
        if (!checkNull(from) && !checkNull(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.BETWEEN, from, to)
        } else if (!checkNull(from)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
        } else if (!checkNull(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN_OR_EQUAL, to)
        } else {
            return this
        }
    }

    iNBT(from, to) {
        if (!checkNull(from) && !checkNull(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.NOT_BETWEEN, from, to)
        } else if (!checkNull(from)) {
            return this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN, from)
        } else if (!checkNull(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN, to)
        } else {
            return this
        }
    }

    eNBT(from, to) {
        if (!checkNull(from) && !checkNull(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.NOT_BETWEEN, from, to)
        } else if (!checkNull(from)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN, from)
        } else if (!checkNull(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN, to)
        } else {
            return this
        }
    }

    iISNULL() {
        return this.rangeValue(Sign.INCLUDED, Operation.IS_NULL)
    }

    eISNULL() {
        return this.rangeValue(Sign.EXCLUDED, Operation.IS_NULL)
    }

    iNNULL() {
        return this.rangeValue(Sign.INCLUDED, Operation.NOT_NULL)
    }

    eNNULL() {
        return this.rangeValue(Sign.EXCLUDED, Operation.NOT_NULL)
    }

    iIN(collect) {
        return checkEmpty(collect) ? this.collectValue(Sign.INCLUDED, Operation.IN, collect) : this
    }

    eIN(collect) {
        return checkEmpty(collect) ? this.collectValue(Sign.EXCLUDED, Operation.IN, collect) : this
    }

    iNIN(collect) {
        return checkEmpty(collect) ? this.collectValue(Sign.INCLUDED, Operation.NOT_IN, collect) : this
    }

    eNIN(collect) {
        return checkEmpty(collect) ? this.collectValue(Sign.EXCLUDED, Operation.NOT_IN, collect) : this
    }
}
