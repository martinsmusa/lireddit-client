import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';
import { typedUpdateQuery } from './typedUpdateQuery';

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:3003/graphql',
    fetchOptions: {
        credentials: 'include',
        headers: {
            'x-forwarded-proto': 'https'
        }
    } as const,
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    login: (dataFields, _args, cache) => {
                        return typedUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            dataFields,
                            (result, data) => {
                                if (result.login.errors) {
                                    return data;
                                }

                                return {
                                    me: result.login.user
                                };
                            }
                        );
                    },
                    register: (dataFields, _args, cache) => {
                        typedUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            dataFields,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                }

                                return {
                                    me: result.register.user
                                };
                            }
                        );
                    },
                    logout: (_fields, _args, cache) => {
                        return cache.updateQuery({ query: MeDocument }, () => {
                            return { me: null };
                        });
                    }
                }
            }
        }),
        ssrExchange,
        fetchExchange
    ],
});
