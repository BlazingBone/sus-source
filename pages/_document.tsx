import { Html, Head, Main, NextScript } from 'next/document'
import {useTheme} from "next-themes";

export default function Document() {

  const {theme, setTheme} = useTheme();

  return (
    <Html suppressHydrationWarning lang="en">
      <Head/>
      <body className={`relative`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
