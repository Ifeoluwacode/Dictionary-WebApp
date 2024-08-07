import { useState, useEffect } from "react";
import "./App.css";
import useDarkSide from "./useDarkSide";
import { useKey } from "./useKey";

function App() {
  const [word, setWord] = useState([]);
  const [search, setSearch] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const [font, setFont] = useState("sans");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawWord, setRawWord] = useState([]);

  const handleFontfamily = (value) => {
    setFont(value);
    // console.log(value);
  };

  useKey("Enter", handleSearch);
  function handleSearch() {
    setSearchWord(search);
  }

  const toggleDarkMode = () => {
    setTheme(colorTheme);
    setDarkSide(!darkSide);
    // console.log(colorTheme);
    // console.log(darkSide);
  };

  useEffect(
    function () {
      async function fecthWord() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
          );
          if (!res.ok) throw new Error("something went wrong");
          const data = await res.json();
          setRawWord(data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (searchWord.length < 1) {
        setRawWord([]);
        setError("");
        return;
      }
      fecthWord();
    },
    [searchWord]
  );

  useEffect(
    function () {
      const filterOutLongestArray = () => {
        const objectWithLongestArray = rawWord.reduce(
          (max, obj) => (obj.meanings.length > max.meanings.length ? obj : max),
          rawWord[0]
        );

        const filteredData = rawWord.filter(
          (obj) => obj === objectWithLongestArray
        );

        setWord(filteredData);
      };
      filterOutLongestArray();
    },
    [rawWord]
  );

  return (
    <div
      className={`flex justify-center dark:bg-[#050505] min-h-[100vh] font-${font} pt-6`}
    >
      <div className="w-[60%]">
        <Nav
          toggleDarkMode={toggleDarkMode}
          darkSide={darkSide}
          onFamilyFont={handleFontfamily}
          colorTheme={colorTheme}
        />
        <Search setSearch={setSearch} onSearch={handleSearch} />
        {isLoading && <Loading />}

        {!error && !isLoading && (
          <>
            {word.map((words, index) => (
              <Word words={words} key={index} />
            ))}
          </>
        )}
        {error && <ErrorMessage />}
      </div>
    </div>
  );
}
function Nav({ toggleDarkMode, darkSide, colorTheme, onFamilyFont }) {
  return (
    <div className="flex justify-between items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 34 38"
      >
        <g
          fill="none"
          fillRule="evenodd"
          stroke="#838383"
          strokeLinecap="round"
          strokeWidth="1.5"
        >
          <path d="M1 33V5a4 4 0 0 1 4-4h26.8A1.2 1.2 0 0 1 33 2.2v26.228M5 29h28M5 37h28" />
          <path strokeLinejoin="round" d="M5 37a4 4 0 1 1 0-8" />
          <path d="M11 9h12" />
        </g>
      </svg>
      <div className="flex gap-5 flex-row items-center max-[350px]:gap-3">
        <select
          className="focus:outline-none dark:bg-black dark:text-[#fff] font-bold max-[350px]:text-[12px] max-[400px]: w-24 "
          name=""
          id=""
          onChange={(e) => onFamilyFont(e.target.value)}
        >
          <option
            className="font-sans font-bold hover:text-[#a445ed] "
            value="sans"
          >
            San Serif
          </option>
          <option
            className="font-serif font-bold hover:text-[#a445ed] "
            value="serif"
          >
            Serif
          </option>
          <option
            className="font-mono font-bold hover:text-[#a445ed] "
            value="mono"
          >
            Mono
          </option>
        </select>

        <div className="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in cursor-pointer ">
          <input
            type="checkbox"
            name="toggle"
            id="toggle"
            className="toggle-checkbox absolute block w-4 h-[14px] m-[1px] rounded-full bg-white appearance-none cursor-pointer"
            checked={darkSide}
            onChange={() => toggleDarkMode()}
          />
          <label
            htmlFor="toggle"
            className="toggle-label block overflow-hidden h-4 rounded-full bg-[#757575] cursor-pointer"
          ></label>
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 22 22"
          >
            <path
              fill="none"
              stroke={`${colorTheme}` === "dark" ? "#757575" : "#a445ed"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M1 10.449a10.544 10.544 0 0 0 19.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 0 0 1 10.449Z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
function Search({ setSearch, onSearch }) {
  return (
    <div className="flex justify-center my-5">
      <div className="bg-[#e9e9e9] dark:bg-[#1F1F1F] flex justify-between flex-row w-[100%] mx-2 rounded-[5px] items-center py-2 px-4 dark:placeholder:[#fff] dark:text-[#ffff]">
        <input
          className=" border-0 bg-transparent w-[80%] focus:outline-0"
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="cursor-pointer" onClick={() => onSearch()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 18 18"
          >
            <path
              fill="none"
              stroke="#A445ED"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m12.663 12.663 3.887 3.887M1 7.664a6.665 6.665 0 1 0 13.33 0 6.665 6.665 0 0 0-13.33 0Z"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
function Word({ words }) {
  useEffect(
    function () {
      if (!words) return;
      document.title = `${words.word}`;
      return function () {
        document.title = "MyDictionary";
      };
    },
    [words]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold dark:text-[#ffff] ">
            {words.word}
          </h1>
          <p className="text-[#a445ed] my-3">{words.phonetic}</p>
        </div>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="42"
            viewBox="0 0 75 75"
          >
            <g fill="#A445ED" fillRule="evenodd">
              <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
              <path d="M29 27v21l21-10.5z" />
            </g>
          </svg>
        </span>
      </div>
      {words.meanings.map((meaning) => (
        <Meaning meaning={meaning} key={meaning.partOfSpeech} />
      ))}
    </div>
  );
}

function Meaning({ meaning }) {
  return (
    <div className="text-left mb-8 " key={meaning.partOfSpeech}>
      <h1 className="font-semibold italic text-xl my-4 text-[#2D2D2D] dark:text-[#fff]">
        {meaning.partOfSpeech}
      </h1>
      <p className=" text-[#757575] text-left">Meaning</p>
      {meaning.definitions.map((definition, index) => (
        <ul
          className="text-sm list-disc list-outside my-2 ms-6"
          key={definition.definition}
        >
          <li className="text-[#a445ed]" key={index}>
            <p className="text-[#2D2D2D] dark:text-[#ffff]">
              {definition.definition}
            </p>
          </li>

          {definition.example && (
            <p className="text-[#757575] italic dark:text-[#ffff]">
              "{definition.example}"
            </p>
          )}
        </ul>
      ))}
    </div>
  );
}
function ErrorMessage() {
  return (
    <div className="flex flex-col justify-center text-center mt-24">
      <span>😕</span>
      <h2 className="text-[#2D2D2D] dark:text-[#fff] font-bold text-base my-3">
        No Definitions Found
      </h2>
      <p className="text-[#757575] text-sm">
        Sorry pal, we couldn't find definitions for the word you were looking
        for. You can try the search again at later time or head to the web
        instead.
      </p>
    </div>
  );
}
function Loading() {
  return (
    <div className="text-center text-[#2d2d2d] dark:text-[#fff] mt-28">
      <p className=" italic"> Loading...</p>
    </div>
  );
}

export default App;
