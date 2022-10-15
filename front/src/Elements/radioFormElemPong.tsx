import React from "react";

type PropsT = {
  choice: any;
  options: string[];
  setChoice: (choice: any) => void;
};

export default function RadioFormElemPong(props: PropsT) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setChoice(parseFloat(e.target.value));
  };

  const OptionsElem = props.options.map((elem, idx) => (
    <li key={elem} className="w-full border-b border-indigo-200 sm:border-b-0 sm:border-r ">
      <div className="flex items-center pl-3 bg-indigo-400 border rounded-lg">
        <input
		  className="w-4 h-4 accent-sky-600"
          name="mode"
          type="radio"
          value={idx}
          checked={props.choice === idx}
          onChange={handleChange}
        />
        <label className="py-3 ml-2 w-full text-sm font-medium text-gray-900" key={idx}>{elem}</label>
      </div>
    </li>
  ));

  return (
    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 sm:flex">
      {OptionsElem}
    </ul>
  );
}
