import { FC, useState } from 'react';
import { Wrapper } from '../components/Wrapper';
import { Form, Formik } from 'formik';
import { Box, Button, FormControl } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import * as React from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: FC = () => {
    const [complete, setComplete] = useState<boolean>(false);
    const [, requestPasswordReset] = useForgotPasswordMutation();

    return (
        <Wrapper variant={ 'small' }>
            <Formik
                initialValues={ { email: '' } }
                onSubmit={ async ({ email }) => {
                    await requestPasswordReset({ email });

                    setComplete(true);
                } }
            >
                { ({ values, handleChange, isSubmitting }) => complete
                    ? (
                        <Box>
                            If an email exists, we rent You a reset link.
                        </Box>
                    )
                    : (
                        <Form>
                            <FormControl>
                                <InputField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    placeholder="Email"
                                    onChange={ handleChange }
                                    value={ values.email }
                                />
                            </FormControl>
                            <Button
                                mt={ 4 }
                                type="submit"
                                colorScheme="teal"
                                isLoading={ isSubmitting }
                            >
                                Reset password
                            </Button>
                        </Form>
                    ) }
            </Formik>
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
