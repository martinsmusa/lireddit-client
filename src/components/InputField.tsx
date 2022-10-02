import { FC, InputHTMLAttributes } from 'react';
import { useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import * as React from 'react';

export const InputField: FC<InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
}> = ({ size, ...props }) => {
    const [field, { error, touched }] = useField(props);

    return (
        <FormControl isInvalid={ !!error }>
            <FormLabel htmlFor={ field.name }>{ props.label }</FormLabel>
            <Input
                { ...field }
                { ...props }
                id={ field.name }
                isInvalid={ !!error }
                placeholder={ props.placeholder }
            />
            <FormErrorMessage>{ error }</FormErrorMessage>
        </FormControl>
    );
};