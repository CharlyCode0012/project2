import { useEffect } from "react";

const useLogger = (entity, message) => {

  // It just logs the entity whenever it changes
  useEffect(() => {
    console.log(message);
    console.log(entity);
  }, [ entity, message ]);
}

export default useLogger;