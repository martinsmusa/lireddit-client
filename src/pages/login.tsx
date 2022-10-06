import * as React from 'react';
import { FC } from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

export const Login: FC = () => {
    const [, login] = useLoginMutation();
    const router = useRouter();

    return (
        <Wrapper variant={ 'small' }>
            <Formik
                initialValues={ { username: '', password: '' } }
                onSubmit={ async (values, { setErrors }) => {
                    const { data } = await login({ auth: values });

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
                                id="username"
                                name="username"
                                label="Username"
                                placeholder="Username"
                                onChange={ handleChange }
                                value={ values.username }
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
