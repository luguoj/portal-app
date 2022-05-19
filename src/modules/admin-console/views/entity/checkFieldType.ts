import {DomainSchema} from "@/services/entity";

export type FieldType = 'boolean' | 'number' | 'string' | 'date' | undefined

export function checkFieldType(fieldSchema: DomainSchema): FieldType {
    switch (fieldSchema.type) {
        case 'boolean':
        case 'java.lang.Boolean':
            return 'boolean'
        case 'java.lang.String':
            return 'string'
        case 'int':
        case 'java.lang.Integer':
        case 'long':
        case 'java.lang.Long':
        case 'java.math.BigDecimal':
            return 'number'
        case 'java.time.LocalDateTime':
            return 'date'
    }
}