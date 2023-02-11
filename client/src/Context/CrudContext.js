import React, { useState, useEffect, useCallback, createContext } from "react";
import { helpHTTP } from "../helper/helpHTTP";
import { useModal } from "../hooks/useModal";

const CrudContext = createContext();

/**
 * It takes a url and a path and returns a list of objects.
 * @returns an object with the properties:
 * db,
 * error,
 * loading,
 * createData,
 * dataToEdit,
 * setDataToEdit,
 * updateData,
 * deleteData,
 * findData,
 * isOpenForm,
 * closeModalForm,
 * handleCreate,
 * create,
 * nav
 */
function CrudProvider({ children, url, path, flag = true }) {
  const [categories, setCategories] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpenForm, openModalForm, closeModalForm] = useModal(false);
  const [create, setCreate] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  //let Url = path;
  let api = helpHTTP();

  /**
   * If there is no error, set the database to the response, otherwise set the database to an empty
   * array and set the error to the response.
   */
  const get = async () => {
    setLoading(true);
    let Url = `${url}?order=${order}`;
    let res = await api.get(Url);
    //console.log(res);
    if (!res.err) {
      setDb(res);
      console.log(res);
      setError(null);
    } else {
      setDb([]);
      setError(res);
    }

    setLoading(false);
  };

  /**
   * I'm trying to get the url from the props and then add the name to the end of the url and then send
   * it to the api and returns a list of objects
   * @param name - the name of the user
   * @param Url - http://localhost:8080/getUserByName/{name}?order=ASC
   */
  const getData = async (data, Url) => {
    setLoading(true);
    let tempUrl = Url.split("?");

    // Url = url + "/route/" + data + ? + order=ASC;
    console.log(tempUrl);
    Url = `${url}${tempUrl[0]}${data}?${tempUrl[1]}`;
    let res = await api.get(Url);
    console.log(Url);
    if (!res.err) {
      setDb(res);
      setError(null);
    } else {
      setDb([]);
      setError(res);
    }
    setLoading(false);
  };

  const getSelect = async (Url, flag=true) => {
    const options = await api.get(Url);
    if(flag){
      setCatalogs(options);
    }
    else{
      setCatalogs(options);
    }
  };

  useEffect(() => {
    if (flag) get();
  }, []);

  /**
   * It takes a data object, sets the create state to false, sets the data id to the current date if
   * it's null, sets the options to the data object, makes a post request to the url, and if there's no
   * error, it sets the db state to the response and sets the error state to null, otherwise it sets
   * the error state to the response.
   * @param data - {
   */
  async function createData(data) {
    setCreate(false);
    if (data.id === null) data.id = Date.now();

    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };
    let res = await api.post(url, options);
    console.log(res);
    if (!res.err) {
      setDb([...db, res]);
      setError(null);
    } else {
      setError(res);
    }
    closeModalForm();
  }

  /**
   * It takes a data object, makes a PUT request to the API, and if there's no error, it updates the
   * state of the db array with the new data
   * @param data - {id: 1, name: "John"}
   */
  const updateData = async (data) => {
    let endpoint = `${url}/${data.id}`;
    console.log(`update endpint: ${endpoint}`);
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };
    let res = await api.put(endpoint, options);
    if (!res.err) {
      /* setDb([...db, res]); */
      let newData = db.map((el) => (el.id === data.id ? data : el));
      setDb(newData);
      setError(null);
    } else {
      setError(res);
    }
    closeModalForm();
  };

  /* A function that is called when the user clicks on the delete button. */
  const deleteData = (name, id) => {
    /**
     * If the user confirms the deletion, then the function will delete the user from the database and
     * update the table with the new data.
     * @param id - the id of the user to be deleted
     * @returns the result of the function funDelete.
     */
    const funDelete = async (id) => {
      let isDelete = window.confirm(
        `¿Estás seguro que quieres eliminar a: ${name}?`
      );

      let options = {
        headers: { "content-type": "application/json" },
      };

      if (isDelete) {
        let endpoint = `${url}/${id}`;
        let res = await api.del(endpoint, options);
        if (!res.err) {
          let newData = db.filter((el) => el.id !== id);
          setDb(newData);
          setError(null);
        } else {
          setError(res);
        }
      } else {
        return;
      }
    };

    funDelete(id);
  };

  /* A function that is called when the user clicks on the edit button. */
  const findData = useCallback(
    (id) => {
      setDataToEdit(null);
      let item = db.find((el) => el.id === id);
      console.log(`find id: ${item.id}`);
      console.log(item);
      setDataToEdit(item);
      openModalForm();
    },
    [db, openModalForm]
  );

  /**
   * When the user clicks the button, the modal form is opened and the state of the create variable is
   * set to true.
   * @param e - the event object
   */
  const handleCreate = (e) => {
    setCreate(true);
    setDataToEdit(null);
    openModalForm();
  };

  /**
   * It's a function that validates a search, if the search is valid it will return a function that
   * will make a request to the server, if the search is not valid it will return an error.
   * </code>
   * @param validationSearch - function that validates the search
   * @param setErrors - is a function that sets the state of errors to the value that is passed to it.
   * @param errors - is a state that is set to null by default, and is set to "error" when the search
   * is not valid.
   * @param navigate - is a function that redirects to a new page
   * @returns the result of the function getCel, getName, get or setErrors.
   */
  const handleSearch = (validationSearch, setErrors, errors, navigate) => {
    const typeGet = validationSearch(navSearch, path, order, navigate);

    if (navSearch === "") {
      if (errors !== null) setErrors(null);
      navigate({ pathname: path, search: "?order=" + order });
      return get();
    }


    if (typeGet.text !== "") {
      if (errors !== null) setErrors(null);
      return getData(navSearch, typeGet.url);
    }

    return setErrors("error");
    //return console.log({error: "Solo se puede filtrar por medio de no. celular y por nombre"});
  };

  const data = {
    db,
    error,
    loading,
    createData,
    dataToEdit,
    setDataToEdit,
    updateData,
    deleteData,
    findData,
    isOpenForm,
    closeModalForm,
    handleCreate,
    create,
    getSelect,
    navSearch,
    setNavSearch,
    handleSearch,
    setOrder,
    path,
    url,
    categories,
    catalogs
  };
  return <CrudContext.Provider value={data}>{children}</CrudContext.Provider>;
}

export { CrudProvider };

export default CrudContext;
