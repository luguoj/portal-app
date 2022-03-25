export class FilterOptions {
    private readonly _record: Record<string, ValueRange[]>

    constructor() {
        this._record = {}
    }

    put(key: string, valueRanges: ValueRange[]) {
        this._record[key] = valueRanges
        return this
    }

    record() {
        return this._record
    }
}

export type ValueType = string | boolean | number | Date
export type NullableValueType = ValueType | null
export type CollectType = ValueType[]
export type NullableCollectType = CollectType | null

export class ValueRange {
    private _sign: Sign;
    private _operation: Operation;
    private _from: NullableValueType = null;
    private _to: NullableValueType = null;
    private _collect: NullableCollectType = null;

    constructor(sign: Sign, operation: Operation) {
        this._sign = sign
        this._operation = operation
    }

    setValue(from: ValueType, to?: ValueType) {
        this._from = from
        if (to !== undefined) {
            this._to = to
        }
        return this
    }

    setCollect(collect: ValueType[]) {
        this._collect = collect
    }
}


export enum Operation {
    EQUAL = 'EQUAL',
    NOT_EQUAL = 'NOTEQUAL',
    LIKE = 'LIKE',
    NOT_LIKE = 'NOTLIKE',
    GRATER_THAN = 'GRATERTHAN',
    GRATER_THAN_OR_EQUAL = 'GRATERTHANOREQUAL',
    LESS_THAN = 'LESSTHAN',
    LESS_THAN_OR_EQUAL = 'LESSTHANOREQUAL',
    BETWEEN = 'BETWEEN',
    NOT_BETWEEN = 'NOTBETWEEN',
    IS_NULL = 'ISNULL',
    NOT_NULL = 'NOTNULL',
    IN = 'IN',
    NOT_IN = 'NOTIN'
}

export enum Sign {
    INCLUDED = 'INCLUDED',
    EXCLUDED = 'EXCLUDED'
}