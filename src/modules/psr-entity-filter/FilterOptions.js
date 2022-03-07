export class FilterOptions {
    constructor() {
    }

    put(key, valueRanges) {
        this[key] = valueRanges
        return this
    }
}

export class ValueRange {
    constructor(sign, operation) {
        this.sign = sign
        this.operation = operation
    }

    setFrom(from) {
        this.from = from
        return this
    }

    setTo(to) {
        this.to = to
        return this
    }

    setCollect(collect) {
        this.collect = collect
    }

}


export const Operation = {
    EQUAL: 'EQUAL',
    NOT_EQUAL: 'NOTEQUAL',
    LIKE: 'LIKE',
    NOT_LIKE: 'NOTLIKE',
    GRATER_THAN: 'GRATERTHAN',
    GRATER_THAN_OR_EQUAL: 'GRATERTHANOREQUAL',
    LESS_THAN: 'LESSTHAN',
    LESS_THAN_OR_EQUAL: 'LESSTHANOREQUAL',
    BETWEEN: 'BETWEEN',
    NOT_BETWEEN: 'NOTBETWEEN',
    IS_NULL: 'ISNULL',
    NOT_NULL: 'NOTNULL',
    IN: 'IN',
    NOT_IN: 'NOTIN'
}
export const Sign = {
    INCLUDED: 'INCLUDED',
    EXCLUDED: 'EXCLUDED'
}