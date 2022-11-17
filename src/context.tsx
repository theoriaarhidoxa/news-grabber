import React, {PropsWithChildren, useContext, useState} from "react";
import fake from './fake.js';
import {AppContextInterface, INewsEntry} from "./interfaces";
import moment, {Moment} from "moment";

const AppContext = React.createContext<AppContextInterface>({
    savedItems: [],
    setSavedItems: () => {},
    foundItems: [],
    handleFoundItemsRetrieve: () => {},
    handleEntryAddition: () => () => {},
    handleEntryRemoving: () => {},
    handleCommentTyping: () => {},
    alert: false,
    setAlert: () => {},
    query: '',
    setQuery: () => {},
    date: '',
    handleSearchRequest: () => {},
    error: null,
    modalVisible: false,
    setModalVisible: () => {},
    handleDateChange: () => {},
    loading: false
});

const AppProvider = (props: PropsWithChildren<React.ReactNode>) => {
    const {children} = props;
    const apiKey = process.env.REACT_APP_API_KEY;

    const [foundItems, setFoundItems] = useState<any[]>([]);
    const [savedItems, setSavedItems] = useState<INewsEntry[]>(JSON.parse(localStorage.getItem('savedItems') || '[]'));
    const [alert, setAlert] = useState(false);

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState<string | null>('');

    const dateFormatter = (date: Moment) => {
        const d = date.toDate() || new Date();
        const day = d.getDate(), month = d.getMonth() + 1, year = d.getFullYear();
        return [year, month, day].map(el => el.toString().length < 2 ? '0' + el : el).join('-');
    };

    const [query, setQuery] = useState('');
    const [date, setDate] = useState(dateFormatter(moment()));

    const dataFetching = async () => {
        const url = `https://newsapi.org/v2/everything?q=${query}&from=${date}&apiKey=${apiKey}`;
        try {
            const res = await fetch(url), fin = await res.json();
            switch (fin.status) {
                case 'ok':
                    handleFoundItemsRetrieve(fin['articles'].length ? fin['articles']
                        .filter((el: any): boolean => el.title) : []);
                    setError(null);
                    break;
                case 'error':
                    setError(fin.message);
                    break;
                default:
                    break;
            }
        } catch (e) {
            setError(`Ошибка при получении данных`);
        }
    };

    const handleFoundItemsRetrieve = (arr: any[]) => {
        setFoundItems(arr);
    };

    const handleEntryAddition = (url: string) => {
        if (savedItems.find((el: INewsEntry): boolean => el.url === url)) {
            setAlert(true);
            return;
        }
        const foundEl = foundItems.find(el => el.url === url);
        const newsObject: INewsEntry = {
            author: foundEl.author,
            title: foundEl.title,
            description: foundEl.description ? foundEl.description.substring(0, 200) + '...' : '',
            imageSource: foundEl.urlToImage,
            url,
            date: foundEl?.publishedAt.split('T')[0].split('-').reverse().join('.'),
            comment: '',
            order: new Date().getTime(),
            currentSelection: false
        };
        setSavedItems([...savedItems, newsObject]);
        localStorage.setItem('savedItems', JSON.stringify([...savedItems, newsObject]));
        setFoundItems(foundItems.filter(el => el.url !== url));
        setAlert(false);
    };

    const handleEntryRemoving = (url: string, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const list = savedItems.filter(el => el.url !== url);
        setSavedItems(list);
        localStorage.setItem('savedItems', JSON.stringify(list));
        const classes = (((event.target as HTMLSpanElement).parentNode) as HTMLDivElement).classList;
        classes.add('hidden');
    };

    const handleCommentTyping = (text: string, url: string) => {
        const updatedItems = savedItems.map(el => el.url === url ? {...el, comment: text} : el);
        setSavedItems(updatedItems);
        localStorage.setItem('savedItems', JSON.stringify(updatedItems));
    };

    const handleSearchRequest = () => {
        setLoading(true);
        setModalVisible(true);
        dataFetching().then(() => setLoading(false));
        // setTimeout(() => {
        //     handleFoundItemsRetrieve(fake);
        //     setLoading(false);
        // }, 500);
    };

    const handleDateChange = (d: Moment) => {
        const f = dateFormatter(d);
        setDate(f);
    };

    return <AppContext.Provider value={{
        savedItems, setSavedItems, foundItems, handleFoundItemsRetrieve, handleEntryAddition, handleEntryRemoving,
        handleCommentTyping, alert, setAlert, query, setQuery, date, handleSearchRequest, error, modalVisible,
        setModalVisible, handleDateChange, loading}}>{children}</AppContext.Provider>
};

export const useGlobalContext = () => {
    return useContext(AppContext);
};

export {AppProvider};
