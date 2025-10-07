import { useEffect, useState } from "react";
import type { FC, KeyboardEventHandler } from "react";
import "./Finder.css";

type Token = {
  text: string;
  hightlight: boolean;
};

const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitKeep = (text: string, splitter: string): string[] => {
  const pattern = new RegExp(`(${escapeRegex(splitter)})`, "gi");
  return text.split(pattern);
};

const Finder: FC<{
  contents: string;
}> = ({ contents }) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    setTokens([{ text: contents, hightlight: false }]);
  }, []);

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const find = event.currentTarget.value;
    if (!find) {
      setTokens([{ text: contents, hightlight: false }]);
      return;
    }
    setTokens(
      splitKeep(contents, find).map((part) => ({
        text: part,
        hightlight: part.toLowerCase() === find.toLowerCase(),
      }))
    );
  };

  return (
    <div className="finder">
      <div className="find">
        <input
          className="inputFind"
          placeholder="find in text…"
          onKeyUp={onKeyUp}
        />
      </div>
      <div className="document">
        {tokens.map((token) => (
          <span className={token.hightlight ? "hightlight" : ""}>
            {token.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Finder;
