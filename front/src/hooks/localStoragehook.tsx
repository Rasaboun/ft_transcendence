import { useState } from 'react';

export default function useLocalStorage(key?:string) {
  const getStorage = () => {
	if (!key)
		return undefined
	const storageString = localStorage.getItem(key);
	let storage;
	if (storageString != null || storageString != undefined) 
		storage = JSON.parse(storageString);
	else
		storage = undefined
	return storage
  };

  const [storage, setStorage] = useState();

  const saveStorage = (key:string, data:any) => {
    localStorage.setItem(key , JSON.stringify(data));
    setStorage(data);
  };

  return {
    setStorage: saveStorage,
    storage: getStorage(),
	  storage2: getStorage(),
	  storage3: getStorage(),
	  storage4: getStorage(),
	  privChat: getStorage(),
  }
}