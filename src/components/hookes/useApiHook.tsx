import { useState, useContext } from "react";

const useApiHook = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
  
    
    const fetchData = async (url: string, body?: any) => {
        console.log('useApiHook: Making API call to:', url)
        console.log('useApiHook: Request body:', body)
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                method: 'POST',
                body: JSON.stringify(body)
            });
            
            console.log('useApiHook: Response status:', response.status)
            
            if (!response.ok) {
                const errorText = await response.text()
                console.error('useApiHook: Response error:', errorText)
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('useApiHook: Response data:', data)
            setData(data);
        } catch (error) {
            console.error('useApiHook: Error occurred:', error)
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }
    return { data, loading, error, fetchData };
}

export default useApiHook;