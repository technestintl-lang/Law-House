import React from 'react';
import { Paper, Text, Group, ThemeIcon, createStyles } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
  },

  value: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  icon: {
    color: theme.white,
  },
}));

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<TablerIconsProps>;
  color: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const { classes } = useStyles();

  return (
    <Paper className={classes.root}>
      <Group position="apart">
        <div>
          <Text color="dimmed" size="xs" className={classes.title}>
            {title}
          </Text>
          <Text className={classes.value}>{value}</Text>
          {subtitle && (
            <Text color="dimmed" size="sm" mt="xs">
              {subtitle}
            </Text>
          )}
        </div>
        <ThemeIcon
          color={color}
          variant="filled"
          size={56}
          radius="md"
        >
          <Icon size={28} className={classes.icon} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

