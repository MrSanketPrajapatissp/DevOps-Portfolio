import './globals.css';

export const metadata = {
  title: 'Control Plane | DevOps Portfolio',
  description: 'DevOps Engineer portfolio — cloud infrastructure, CI/CD pipelines, and container orchestration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const theme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
          } catch (e) {}
        ` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
