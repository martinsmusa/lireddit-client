import { Cache, QueryInput } from '@urql/exchange-graphcache';

export const typedUpdateQuery = <Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    updateFunction: (r: Result, q: Query) => Query
) => {
    return cache.updateQuery(qi, (data) => {
        return updateFunction(result, data as any) as any;
    });
};
