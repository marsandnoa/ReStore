import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:5000/api/';

const responseBody = (response: AxiosResponse) => response.data;

const sleep=() => new Promise(resolve=>setTimeout(resolve,1000));

axios.interceptors.response.use(async response => {
    await sleep();
    return response;
}, (error: AxiosError) => 
{
    const {data, status} = error.response! as AxiosResponse;
    switch (status) {
        case 400:
            
        if(data.errors){
                const modalStateErrors=[];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }

            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            toast.error(data.title);
            break;
        case 500:
            window.location.replace('/server-error');
            break;
        
        default:
            break;
    }

    return Promise.reject(error.response);    
});

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
    list: () => requests.get('/Products'),
    details: (id: number) => requests.get(`/Products/${id}`),
};

const TestErrors={
    get400:()=>requests.get('/buggy/bad-request'),
    get401:()=>requests.get('/buggy/unauthorized'),
    get404:()=>requests.get('/buggy/not-found'),
    get500:()=>requests.get('/buggy/server-error'),
    getValidationError:()=>requests.post('/buggy/validation-error',{}),
}
const agent={
    Catalog,
    TestErrors
}

export default agent;