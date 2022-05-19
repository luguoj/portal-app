import {CollectType, FilterOptions, NullableCollectType, NullableValueType, Operation, Sign, ValueRange, ValueType} from "@/libs/services/psr-entity-crud/FilterOptions"

export class FilterOptionsBuilder {
    private readonly filterOptions: FilterOptions;

    constructor(filterOptions?: FilterOptions) {
        this.filterOptions = filterOptions || new FilterOptions()
    }

    field(name: string) {
        const valueRangesBuilder = new ValueRangesBuilder(this)
        this.filterOptions.put(name, valueRangesBuilder.get())
        return valueRangesBuilder
    }

    get() {
        return this.filterOptions.record()
    }
}

function checkValue(value: NullableValueType): value is ValueType {
    return value !== undefined && value !== null && value !== ''
}

function checkCollect(collect: NullableCollectType): collect is CollectType {
    return collect !== undefined && collect !== null && collect.length > 0
}

class ValueRangesBuilder {
    private readonly _filterOptionsBuilder: FilterOptionsBuilder;
    private readonly _valueRanges: ValueRange[];

    constructor(filterOptionsBuilder: FilterOptionsBuilder) {
        this._filterOptionsBuilder = filterOptionsBuilder
        this._valueRanges = []
    }

    get() {
        return this._valueRanges
    }

    then() {
        return this._filterOptionsBuilder
    }

    nullValue(sign: Sign, operation: Operation) {
        this._valueRanges.push(new ValueRange(sign, operation))
        return this
    }

    rangeValue(sign: Sign, operation: Operation, from: ValueType, to?: ValueType) {
        this._valueRanges.push(new ValueRange(sign, operation).setValue(from, to))
        return this
    }

    collectValue(sign: Sign, operation: Operation, collect: ValueType[]) {
        const valueRange = new ValueRange(sign, operation)
        valueRange.setCollect(collect)
        this._valueRanges.push(valueRange)
        return this
    }

    iEqual(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.EQUAL, from) : this
    }

    eEqual(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.EQUAL, from) : this
    }

    iNEqual(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.NOT_EQUAL, from) : this
    }

    eNEqual(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.NOT_EQUAL, from) : this
    }


    iLike(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.LIKE, from) : this
    }

    eLike(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.LIKE, from) : this
    }

    iNLike(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.NOT_LIKE, from) : this
    }

    eNLike(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.NOT_LIKE, from) : this
    }

    iGT(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN, from) : this
    }

    eGT(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN, from) : this
    }

    iLT(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN, from) : this
    }

    eLT(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN, from) : this
    }

    iGE(from: NullableValueType) {

        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN_OR_EQUAL, from) : this
    }

    eGE(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN_OR_EQUAL, from) : this
    }

    iLE(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN_OR_EQUAL, from) : this
    }

    eLE(from: NullableValueType) {
        return checkValue(from) ? this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN_OR_EQUAL, from) : this
    }

    iBT(from: NullableValueType, to: NullableValueType) {
        if (checkValue(from) && checkValue(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.BETWEEN, from, to)
        } else if (checkValue(from)) {
            return this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
        } else if (checkValue(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN_OR_EQUAL, to)
        } else {
            return this
        }
    }

    eBT(from: NullableValueType, to: NullableValueType) {
        if (checkValue(from) && checkValue(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.BETWEEN, from, to)
        } else if (checkValue(from)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN_OR_EQUAL, from)
        } else if (checkValue(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN_OR_EQUAL, to)
        } else {
            return this
        }
    }

    iNBT(from: NullableValueType, to: NullableValueType) {
        if (checkValue(from) && checkValue(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.NOT_BETWEEN, from, to)
        } else if (checkValue(from)) {
            return this.rangeValue(Sign.INCLUDED, Operation.LESS_THAN, from)
        } else if (checkValue(to)) {
            return this.rangeValue(Sign.INCLUDED, Operation.GRATER_THAN, to)
        } else {
            return this
        }
    }

    eNBT(from: NullableValueType, to: NullableValueType) {
        if (checkValue(from) && checkValue(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.NOT_BETWEEN, from, to)
        } else if (checkValue(from)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.LESS_THAN, from)
        } else if (checkValue(to)) {
            return this.rangeValue(Sign.EXCLUDED, Operation.GRATER_THAN, to)
        } else {
            return this
        }
    }

    iISNULL() {
        return this.nullValue(Sign.INCLUDED, Operation.IS_NULL)
    }

    eISNULL() {
        return this.nullValue(Sign.EXCLUDED, Operation.IS_NULL)
    }

    iNNULL() {
        return this.nullValue(Sign.INCLUDED, Operation.NOT_NULL)
    }

    eNNULL() {
        return this.nullValue(Sign.EXCLUDED, Operation.NOT_NULL)
    }

    iIN(collect: NullableCollectType) {
        return checkCollect(collect) ? this.collectValue(Sign.INCLUDED, Operation.IN, collect) : this
    }

    eIN(collect: NullableCollectType) {
        return checkCollect(collect) ? this.collectValue(Sign.EXCLUDED, Operation.IN, collect) : this
    }

    iNIN(collect: NullableCollectType) {
        return checkCollect(collect) ? this.collectValue(Sign.INCLUDED, Operation.NOT_IN, collect) : this
    }

    eNIN(collect: NullableCollectType) {
        return checkCollect(collect) ? this.collectValue(Sign.EXCLUDED, Operation.NOT_IN, collect) : this
    }
}
