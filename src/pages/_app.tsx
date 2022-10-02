import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Provider, createClient } from 'urql';

import theme from '../theme';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    const client = createClient({
        url: 'http://localhost:3003/graphql',
        fetchOptions: {
            credentials: 'include'
        },
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
