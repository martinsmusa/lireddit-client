import { FC } from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

export const NavBar: FC = () => {
    const [{ data, fetching }] = useMeQuery();
    const [{ fetching: fetchingLogOut }, logout] = useLogoutMutation();

    const renderBody = () => {
        const renderLogin = (
            <NextLink href="/login">
                <Link mr={ 2 }>Login</Link>
            </NextLink>
        );

        const renderRegister = (
            <NextLink href="/register">
                <Link>Register</Link>
            </NextLink>
        );

        if (fetching) {
            return null;
        }

        if (!data?.me) {
            return (
                <>
                    { renderLogin }
                    { renderRegister }
                </>
            );
        }

        return (
            <Flex>
                <Box mr={ 2 }>
                    { data.me.username }
                </Box>

                <Button
                    disabled={ fetchingLogOut }
                    onClick={ () => logout({}) }
                    type="button"
                    variant="link"
                >
                    Log out
                </Button>
            </Flex>
        );
    };

    return (
        <Flex bg="teal">
            <Box ml="auto" p={ 4 }>
                { renderBody() }
            </Box>
        </Flex>
    );
};
