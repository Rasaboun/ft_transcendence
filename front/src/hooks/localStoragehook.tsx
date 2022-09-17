import { useState } from 'react';

export default function useLocalStorage(key?:string) {
  const getStorage = () => {
	const storageString = localStorage.getItem(key!);
	console.log(storageString)
	let storage
	if (storageString) 
		storage = JSON.parse(storageString);
	else
		storage = null
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
	storage2: getStorage()
  }
}