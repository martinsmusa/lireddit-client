import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]) => errors.reduce((acc, { field, message }) => ({
    ...acc,
    [field]: message
}), {});
