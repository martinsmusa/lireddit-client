import { FieldError } from '../generated/graphql';

export type ErrorMapResponse = Record<FieldError['field'], FieldError['message']>
export const toErrorMap = (
    errors: FieldError[]
): ErrorMapResponse => errors.reduce((acc, { field, message }) => ({
    ...acc,
    [field]: message
}), {});
