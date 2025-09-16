import { useState, useContext } from "react";

const useApiHook = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    
    const fetchData = async (url: string, body?: any) => {
      
      
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',  // ← This is crucial!
                    'Accept': 'application/json'
                  },
                method: 'POST',
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
console.log(data)
            setData(data);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }
    return { data, loading, error, fetchData };
}

export default useApiHook;