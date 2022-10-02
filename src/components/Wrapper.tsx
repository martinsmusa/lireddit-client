import { FC, PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react';

interface IWrapper {
    variant?: 'small' | 'regular';
}

export const Wrapper: FC<PropsWithChildren<IWrapper>> = ({ children, variant = 'regular' }) => {
    return <Box maxW={ variant === 'regular' ? '800px' : '400px' } w={ '100%' } mt={ 8 } mx="auto">{ children }</Box>;
};
