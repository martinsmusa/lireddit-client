import * as React from 'react';
import { FC } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, FormControl, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

export const Login: FC = () => {
    const [, login] = useLoginMutation();
    const router = useRouter();

    return (
        <Wrapper variant={ 'small' }>
            <Formik
                initialValues={ { usernameOrEmail: '', password: '' } }
                onSubmit={ async (values, { setErrors }) => {
                    const { data } = await login(values);

                    if (!data) {
                        return null;
                    }

                    const { login: { errors } } = data;

                    if (errors?.length) {
                        return setErrors(toErrorMap(errors));
                    }

                    return router.push('/');
                } }
            >
                { ({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <FormControl>
                            <InputField
                                id="usernameOrEmail"
                                name="usernameOrEmail"
                                label="usernameOrEmail"
                                placeholder="Username or Email"
                                onChange={ handleChange }
                                value={ values.usernameOrEmail }
                            />
                            <Box mt={ 8 }>
                                <InputField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={ handleChange }
                                    value={ values.password }
                                />
                            </Box>
                            <Flex mt={ 2 }>
                                <NextLink href="/forgot-password">
                                    <Link ml="auto">Forgot Password?</Link>
                                </NextLink>
                            </Flex>
                            <Button
                                mt={ 4 }
                                type="submit"
                                colorScheme="teal"
                                isLoading={ isSubmitting }
                            >
                                Login
                            </Button>
                        </FormControl>
                    </Form>
                ) }
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
