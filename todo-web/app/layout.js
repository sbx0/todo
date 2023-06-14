import '../styles/globals.css'
import '../styles/nprogress.css';

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}
