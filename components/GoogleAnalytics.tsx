'''
'use client';

import Script from 'next/script';

const GoogleAnalytics = () => {
    return (
        <>
            <Script 
                strategy="afterInteractive" 
                src="https://www.googletagmanager.com/gtag/js?id=G-8C4J4JK7ZH"
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-8C4J4JK7ZH');
                    `,
                }}
            />
        </>
    );
};

export default GoogleAnalytics;
'''