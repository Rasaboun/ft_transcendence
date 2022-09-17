import { useState } from 'react';

export default function useLocalStorage() {
  const getStorage = (key:string) => {
    const storageString = localStorage.getItem(key);
    let storage
	if (storageString) 
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
    storage
  }
}