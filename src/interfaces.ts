import {Moment} from "moment";
import React from "react";

export interface INewsEntry {
    author: string;
    title: string;
    description: string;
    imageSource: string;
    url: string;
    date: string;
    comment: string;
    order: number;
    currentSelection: boolean;
}

export interface AppContextInterface {
    savedItems: INewsEntry[];
    setSavedItems: (arr: INewsEntry[]) => void;
    foundItems: any[];
    handleFoundItemsRetrieve: (arr: any[]) => void;
    handleEntryAddition: (url: string) => void;
    handleEntryRemoving: (url: string, event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    handleCommentTyping: (text: string, url: string) => void;
    alert: boolean;
    setAlert: (val: boolean) => void;
    query: string;
    setQuery: (str: string) => void;
    date: string;
    handleSearchRequest: () => void;
    error: string | null;
    modalVisible: boolean;
    setModalVisible: (val: boolean) => void;
    handleDateChange: (d: Moment) => void;
    loading: boolean;
}
