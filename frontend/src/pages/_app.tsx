import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const router = useRouter();
  
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    localStorage.setItem('color-scheme', nextColorScheme);
  };
  
  // Initialize color scheme from localStorage
  useEffect(() => {
    const savedColorScheme = localStorage.getItem('color-scheme') as ColorScheme | null;
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }
  }, []);
  
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>LegisFlow CEMAC</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="description" content="Legal Practice Management for CEMAC Region" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            primaryColor: 'orange',
            fontFamily: 'Roboto, sans-serif',
            headings: { fontFamily: 'Roboto, sans-serif' },
          }}
        >
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

