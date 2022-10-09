import { NextPage } from 'next';
import { Wrapper } from '../../components/Wrapper';
import { Form, Formik } from 'formik';
import { toErrorMap } from '../../utils/toErrorMap';
import { Box, Button, FormControl, Link } from '@chakra-ui/react';
import { InputField } from '../../components/InputField';
import * as React from 'react';
import { useChangePasswordMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';
import { useState } from 'react';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState<string>('');
    const router = useRouter();

    const renderAction = (isSubmitting: boolean) => {
        if (tokenError) {
            return (
                <NextLink href="/forgot-password">
                    <Link>Request password reset</Link>
                </NextLink>
            );
        }

        return (<Button
            mt={ 4 }
            type="submit"
            colorScheme="teal"
            isLoading={ isSubmitting }
        >
            Reset password
        </Button>);
    };

    return (
        <Wrapper variant={ 'small' }>
            <Formik
                initialValues={ { newPassword: '', token: '' } }
                onSubmit={ async ({ newPassword }, { setErrors }) => {
                    const { data } = await changePassword({ newPassword, token });

                    if (!data) return null;
                    const { changePassword: { errors } } = data;

                    if (errors?.length) {
                        const errorMap = toErrorMap(errors);

                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }

                        return setErrors(errorMap);
                    }

                    return router.push('/');
                } }
            >
                { ({ values, handleChange, isSubmitting }) => (
                    <Form>
                        <FormControl>
                            <InputField
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                label="New password"
                                placeholder="New password"
                                onChange={ handleChange }
                                value={ values.newPassword }
                            />
                            <Box color="red">{ tokenError }</Box>
                            { renderAction(isSubmitting) }
                        </FormControl>
                    </Form>
                ) }
            </Formik>
        </Wrapper>
    );
};

ChangePassword.getInitialProps = ({ query }) => ({
    token: query.token as string
});

export default withUrqlClient(createUrqlClient)(ChangePassword);
