import { ReactNode } from 'react';
import { Stack, Text, Title } from '@mantine/core';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function PageSection({ title, description, children }: Props) {
  return (
    <>
      <Title order={2} mb={'xs'}>
        {title}
      </Title>
      <Text mb={'md'} c={'dimmed'}>
        {description}
      </Text>
      <Stack>{children}</Stack>
    </>
  );
}
