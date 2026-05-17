import { ReactNode, useState } from 'react';
import { Card, Collapse, Title } from '@mantine/core';

interface Props {
  title: string;
  children: ReactNode;
}

export function CollapsibleCard({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card shadow={'sm'} padding={'md'} radius={'md'} withBorder>
      <Title
        order={2}
        {...(open ? { mb: 'xs' } : {})}
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
      >
        <span
          style={{
            display: 'inline-block',
            marginRight: '0.5em',
            transition: 'transform 200ms ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            width: 0,
            height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderLeft: '12px solid #228be6',
          }}
        />
        {title}
      </Title>
      <Collapse expanded={open}>{children}</Collapse>
    </Card>
  );
}
