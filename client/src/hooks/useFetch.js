import axios from "axios";
import { useCallback, useMemo, useState } from "react";

axios.defaults.baseURL = "http://127.0.0.1:3200/api"

const useFetch = () => {

  /**
   * Contain info about the requests:
   * 
   * - data: Info fetched by a GET request, or uploaded by 
   *   POST and PUT requests
   * 
   * - error: Errors that could be thrown by any of the requests
   * 
   * - isFetching: State that tells whether the request is or isn't
   *   being processed
   */
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ isFetching, setIsFetching ] = useState(false);

  /**
   * Helper functions that make the enabling and disabling 
   * fetching state process easer to read 
   */
  const beginFetching = () => setIsFetching(true)
  const endFetching = () => setIsFetching(false)

  /**
   * Executes a GET request to the given path
   * 
   * @param path Path upon the base URL, starting with "/"
   * 
   * ```
   * // "https:127.0.0.1/api/categories"
   * get("/categories") 
   * ```
   */
  const get = useCallback(async (path, params) => {
    beginFetching();

    try {
      const response = await axios.get(path, { params });
      setData(response.data);
    }
    catch (error) {
      setError(error)
    }

    endFetching();
  }, [])

  /**
   * Executes a POST request to the given path and uploads
   * the data given in the body
   * 
   * @param path Path upon the base URL, starting with "/"
   * @param body Info that will be uploaded
   * 
   * ```
   * // "https:127.0.0.1/api/categories"
   * post("/categories") 
   * ```
   */
  const post = useCallback(async (path, body) => {
    beginFetching();

    try {
      await axios.post(path, { body });
      setData(body)
    }
    catch (error) {
      setError(error)
    }

    endFetching();
  }, [])

  /**
   * Executes a PUT request to the given path and uploads
   * the data given in the body
   * 
   * @param path Path upon the base URL, starting with "/"
   * @param body Info that will be uploaded
   * 
   * ```
   * // "https:127.0.0.1/api/categories"
   * put("/categories") 
   * ```
   */
  const put = useCallback(async (path, body) => {
    beginFetching();

    try {
      await axios.put(path, { body });
      setData(body)
    }
    catch (error) {
      setError(error)
    }

    endFetching();
  }, [])

  /**
   * Executes a DELETE request to the given path
   * 
   * @param path Path upon the base URL, starting with "/"
   * 
   * ```
   * // "https:127.0.0.1/api/categories"
   * delete("/categories") 
   * ```
   */
  const remove = useCallback(async (path) => {
    beginFetching();

    try {
      await axios.delete(path);
      setData(null)
    }
    catch (error) {
      setError(error)
    }

    endFetching();
  }, [])
  
  /**
   * Contains every HTTP operation that might be used later
   */
  const api = useMemo(() => ({ get, post, put, remove }), [ get, post, put, remove ]);

  return [ data, error, isFetching, api ]
}

export default useFetch;