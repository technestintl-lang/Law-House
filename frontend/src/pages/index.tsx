import React from 'react';
import Head from 'next/head';
import { Grid, Title, Container, Group, Button, Text, Card, SimpleGrid } from '@mantine/core';
import { IconBriefcase, IconUsers, IconCalendarTime, IconClock } from '@tabler/icons-react';
import Layout from '../components/Layout';
import { StatCard } from '../components/StatCard';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Dashboard | LegisFlow CEMAC</title>
      </Head>
      
      <Container size="xl" py="md">
        <Group position="apart" mb="lg">
          <Title order={2}>Dashboard</Title>
          <Button color="orange">New Matter</Button>
        </Group>
        
        <SimpleGrid cols={4} breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}>
          <StatCard
            title="Active Matters"
            value={16}
            icon={IconBriefcase}
            color="orange"
          />
          <StatCard
            title="Clients"
            value={112}
            icon={IconUsers}
            color="blue"
          />
          <StatCard
            title="Upcoming Deadlines"
            value={8}
            icon={IconCalendarTime}
            color="red"
            subtitle="Next: Tomorrow"
          />
          <StatCard
            title="Billable Hours"
            value="25h"
            icon={IconClock}
            color="green"
            subtitle="This month"
          />
        </SimpleGrid>
        
        <Grid mt="xl">
          <Grid.Col md={6}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Title order={4} mb="md">Recent Matters</Title>
              <Text color="dimmed" size="sm">
                No recent matters to display.
              </Text>
            </Card>
          </Grid.Col>
          
          <Grid.Col md={6}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Title order={4} mb="md">Upcoming Deadlines</Title>
              <Text color="dimmed" size="sm">
                No upcoming deadlines to display.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}

