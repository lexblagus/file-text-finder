import { useState } from "react";

import Uploader from "../Uploader";
import Finder from "../Finder";

import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/100.css";
import "./App.css";

function App() {
  const [contents, setContents] = useState<string | null>(null);

  const onLoaded = (text: string) => {
    setContents(text);
  };

  return (
    <section className="wrapper">
      <header>File Text Finder</header>
      <main>{contents ? <Finder contents={contents} /> : <Uploader onLoaded={onLoaded} />}</main>
      <footer>
        <small>
          This project was developed solely for testing and evaluation purposes;
          it is not intended for production use and must not be used for
          commercial purposes. No warranties or guarantees of any kind are
          provided. By <a href="https://blag.us/">Lexa</a> (
          <a href="https://github.com/lexblagus/file-text-finder">source</a>)
        </small>
      </footer>
    </section>
  );
}

export default App;
