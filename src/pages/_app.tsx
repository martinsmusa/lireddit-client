import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Provider, createClient, fetchExchange, dedupExchange } from 'urql';

import theme from '../theme';
import { AppProps } from 'next/app';
import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

const typedUpdateQuery = <Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    updateFunction: (r: Result, q: Query) => Query
) => {
    return cache.updateQuery(qi, (data) => {
        return updateFunction(result, data as any) as any;
    });
};

function MyApp({ Component, pageProps }: AppProps) {
    const client = createClient({
        url: 'http://localhost:3003/graphql',
        fetchOptions: {
            credentials: 'include',
            headers: {
                'x-forwarded-proto': 'https'
            }
        },
        exchanges: [dedupExchange, cacheExchange({
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
        }), fetchExchange],
    });

    return (
        <Provider value={ client }>
            <ChakraProvider theme={ theme }>
                <CSSReset />
                <Component { ...pageProps } />
            </ChakraProvider>
        </Provider>
    );
}

export default MyApp;
