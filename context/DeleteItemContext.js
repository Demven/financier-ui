import {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

const DeleteItemContext = createContext({
  onDeleteItem: undefined,
});

export function DeleteItemProvider ({ children }) {
  const [onDeleteItem, setOnDeleteItem] = useState();

  const registerDeleteItemAction = useCallback((action) => {
    setOnDeleteItem(() => action);
  }, []);

  return (
    <DeleteItemContext.Provider value={{ onDeleteItem, registerDeleteItemAction }}>
      {children}
    </DeleteItemContext.Provider>
  );
}

export function useDeleteItemAction () {
  return useContext(DeleteItemContext);
}
